import { defaultMethodLimits, MethodLimits, RateLimit, Rate } from './limits';
import Regions from './regions';
import microtime from './microtime';

const redis = require('redis');
const Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

export interface LimiterResult {
  key: string;
  remaining: number;
  reset: number;
  total: number;
  value: number;
}

class RateLimiter {
  rateScript: string; // sha1 digest of the Lua script that removes a key from a sorted set without resetting key TTL
  db: any; // redisClient instance
  limits: RateLimit[];
  methodLimits: {[key in keyof MethodLimits]: RateLimit};

  constructor (region: Regions, limits: Rate[] | string, redisClient?: any, spread?: boolean, methodLimits?: {[key in keyof MethodLimits]?: Rate}) {
    if (!redisClient || !redisClient.send_command) {
      this.db = redis.createClient(redisClient);
    } else {
      this.db = redisClient;
    }
    this.methodLimits = {} as {[key in keyof MethodLimits]: RateLimit};

    for (const m in defaultMethodLimits) {
      const { allowedRequests, seconds } = defaultMethodLimits[m];

      this.methodLimits[m] = {
        key: `${region}-${m}`,
        rate: {
          allowedRequests,
          seconds
        }
      };
    }

    if (methodLimits) {
      // welp not yet implemented
    }

    if (typeof limits === 'string') {
      this.limits = [];

      limits.split(',').forEach((s, i) => {
        const [reqs, seconds] = s.split(':').map(ss => parseInt(ss, 10));
        this.limits.push({ key: `${region}-${i}`, rate: { seconds, allowedRequests: reqs } });
      });
    } else {
      this.limits = [
        { key: `${region}-0`, rate: limits[0] },
        { key: `${region}-1`, rate: limits[1] }
      ];
    }

    if (spread) {
      this.limits.unshift({ key: `${region}-spread`, rate: { allowedRequests: this.limits[0].rate.allowedRequests / 10, seconds: 0.5 } });
    }
  }

  init (): Promise<void> {
    return this.db.send_commandAsync('SCRIPT', ['LOAD', `redis.pcall('ZREMRANGEBYSCORE', KEYS[1], 0, ARGV[1])
      local count = redis.pcall('ZCARD', KEYS[1])
      redis.pcall('ZADD', KEYS[1], ARGV[2], ARGV[2])
      local oldest = redis.pcall('ZRANGE', KEYS[1], 0, 0)[1]
      if redis.pcall('PTTL',KEYS[1]) < 0 then
        redis.pcall('PEXPIRE',KEYS[1],ARGV[3])
      end
      return {count, oldest}
      `]).then((sha1: string) => {
        this.rateScript = sha1;
      });
  }

  addRequest (methodType?: keyof MethodLimits): Promise<LimiterResult[]> {
    const limiters = this.limits.slice();

    if (methodType) limiters.push(this.methodLimits[methodType]);

    const { commands, handlers } = limiters.reduce((acc, limiter, i) => {
      const { commands, handler } = this.processRate(limiter, i);

      acc.commands = acc.commands.concat(commands);
      acc.handlers.push(handler);

      return acc;
    }, { commands: [] as any[][], handlers: [] as ((res: string[][]) => LimiterResult)[] });

    return this.db.multi(commands).execAsync()
      .then((response: string[][]) => {
        const results = handlers.map(h => h(response));

        const errored = [];
        const passed = [];

        for (const res of results) {
          if (res.remaining > 0) {
            passed.push(res);
          } else {
            errored.push(res);
          }
        }

        if (errored.length === 0) {
          return passed;
        } else if (passed.length > 0) {
          this.db.multi(passed.map(({ key, value }) => ['ZREM', key, value])).exec_atomic();
        }

        const highestReset = errored.sort((a, b) => {
          return b.reset - a.reset;
        })[0];

        const retryAfter = Math.floor((highestReset.reset - Date.now()) / 1000);

        return Promise.reject({
          key: highestReset.key,
          reset: highestReset.reset,
          after: retryAfter
        });
      });
  }

  updateLimits (rates: string, method?: keyof MethodLimits) {
    rates.split(',').forEach(s => {
      const [reqs, seconds] = s.split(':').map(ss => parseInt(ss, 10));

      if (!method) {
        const limitToUpdate = this.limits.find(l => l.rate.seconds === seconds);

        if (limitToUpdate) {
          limitToUpdate.rate.allowedRequests = reqs;
        }
      } else if (this.methodLimits[method]) {
        this.methodLimits[method].rate.allowedRequests = reqs;
      }
    });
  }

  private processRate (limit: RateLimit, idx: number) {
    const key = limit.key;
    const duration = limit.rate.seconds * 1000;
    const now = microtime();
    const start = now - duration * 1000;

    const commands = [['EVALSHA', this.rateScript, 1, key, start, now, duration]];

    const offset = commands.length * idx;

    const handler = (res: string[][]): LimiterResult => {
      const [count, oldest] = res[offset].map(r => parseInt(r, 10));

      const max = limit.rate.allowedRequests;

      return {
        key,
        remaining: count < max ? max - count : 0,
        reset: oldest / 1e3 + duration,
        total: max,
        value: now
      };
    };

    return {
      commands,
      handler
    };
  }
}

export { Regions, Rate, MethodLimits, defaultMethodLimits };

export default RateLimiter;

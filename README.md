# Riot API Redis Limiter

A Rate Limiter backed by Redis for use with Riot API projects

## Usage

```ts
const redis = require('redis');
// see src/regions.ts for valid regions
const limiter = new RateLimiter('euw', '20:1,2000:60', redis.createClient());
// init() loads the Lua scripts to Redis
limiter.init().then(() => {
  // see src/limits.ts for default methods
  // you can also pass no arguments to not use a method limit
  limiter.addRequest('GET_MATCH')
    .then(limiterResults => {
      // proceed with your request
      
      // ...

      // optionally you may inspect the rate limiter result objects
      limiterResults.forEach(res => {
        const {key, remaining, total, reset} = res;
      })
    })
    .catch(err => {
      if (err.hasOwnProperty('after')) {
        // Rate limit was hit, reset is in epoch miliseconds
        const {key, after, reset} = err;

        console.log(`${key} limiter was hit, retry after ${after} seconds`);
      }
    })
});
```

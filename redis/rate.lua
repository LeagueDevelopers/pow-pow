--[[
  Run once for every rate limit (requests per window)

  KEYS[1]: Limiter key
  ARGV[1]: Start of rate limit window
  ARGV[2]: Timestamp of request (microseconds pref.)
  ARGV[3]: Duration of rate limit window (milis)
]]

-- Remove all requests from before the current window from sorted set
redis.pcall('ZREMRANGEBYSCORE', KEYS[1], 0, ARGV[1])

-- Count requests in current window
local count = redis.pcall('ZCARD', KEYS[1])

-- Add the current request to the sorted set
redis.pcall('ZADD', KEYS[1], ARGV[2], ARGV[2])

-- Get oldest request (only needed if you want to communicate when this window resets)
local oldest = redis.pcall('ZRANGE', KEYS[1], 0, 0)[1]

-- If this rate limiter doesn't have an expiry date, reset it
if redis.pcall('PTTL',KEYS[1]) < 0 then
  redis.pcall('PEXPIRE',KEYS[1],ARGV[3])
end

return {count, oldest}

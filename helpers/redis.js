let redis;

if (process.env.REDISTOGO_URL) {
  let rtg = new URL(process.env.REDISTOGO_URL)
  redis = require("redis").createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]);
} else {
  redis = require("redis").createClient();
}

module.exports = redis
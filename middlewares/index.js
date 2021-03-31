const { fetchAndModifiy } = require('../helpers')
const redis = require('../helpers/redis')
const LATEST_CHAPTER = process.env.LATEST_CHAPTER || 138

const setScrapeUrl = (req, res, next) => {
  let url = req.url
  if (url === "/") {
    url = "https://ww7.readsnk.com"
  } else {
    const chapterId = +url.match(/\d+/)[0]
    url = `https://ww7.readsnk.com/chapter/shingeki-no-kyojin-chapter-${chapterId}`
    if (chapterId > LATEST_CHAPTER) url = "https://ww7.readsnk.com/not%20found"
  }
  req.targetUrl = url
  next()
}

const responseHandler = (req, res, next) => {
  try {
    redis.get(req.targetUrl, function (err, reply) {
      if (reply) {
        res.send(reply);
      } else {
        // Fetch html content and manipulate DOM
        fetchAndModifiy(req.targetUrl, {
          host: req.protocol + '://' + req.get('host'),
          resolve: (htmlData) => {
            res.send(htmlData)
            redis.set(req.targetUrl, htmlData)
          },
          reject: (err) => res.send(err)
        })
      }
    });

  } catch (error) {
    res.send({ error: error.message })
  }
}

module.exports = {
  setScrapeUrl,
  responseHandler
}
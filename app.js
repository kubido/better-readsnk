const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000
const LATEST_CHAPTER = process.env.LATEST_CHAPTER


const fetchAndModifiy = (url, options = {}) => {
  axios.get(url)
    .then(resp => {
      let htmlData = resp.data
        .replace(/<img/g, "<img loading=\"lazy\" width=\"1600\" height=\"1124\"")
        .replace(/href\=\"\/css/g, 'href="https://ww7.readsnk.com/css')
        .replace(/src\=\"\/js/g, 'href="https://ww7.readsnk.com/js')
        // .replace(/https:\/\/(.*-)([0-9]+)/g, `/chapter/$2`)
        .replace(/(https:\/\/.*\/chapter\/)(.+)([0-9]+)"/g, '/chapter/$2$3"')
      options.resolve(htmlData)
    })
    .catch(err => {
      options.reject({ url, error: err.message })
    })
}

// Middleware
// Make request to readsnk.com based on request.url
app.use((req, res, next) => {
  let url = req.url
  if (url === "/") {
    url = "https://ww7.readsnk.com"
  } else {
    const chapterId = +url.match(/\d+/)[0]
    url = `https://ww7.readsnk.com/chapter/shingeki-no-kyojin-chapter-${chapterId}`
    if (chapterId >= LATEST_CHAPTER) url = "https://ww7.readsnk.com/not%20found"
  }

  // Fetch html content and manipulate DOM
  try {
    fetchAndModifiy(url, {
      host: req.protocol + '://' + req.get('host'),
      resolve: (htmlData) => res.send(htmlData),
      reject: (err) => res.send(err)
    })
  } catch (error) {
    res.send({ error: err.message })
  }
})

// APP ROUTES
app.get("/", (req, res) => res.send(req.htmlData))
app.get('/chapter/:chapterId', (req, res) => res.send(req.htmlData))

app.listen(PORT, () => console.log('server started at port ' + PORT))
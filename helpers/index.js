const axios = require('axios');

const fetchAndModifiy = (url, options = {}) => {
  axios.get(url)
    .then(resp => {
      let htmlData = resp.data
        .replace(/<img/g, "<img loading=\"lazy\" width=\"1600\" height=\"1124\"")
        .replace(/href\=\"\/css/g, 'href="https://ww7.readsnk.com/css')
        .replace(/src\=\"\/js/g, 'href="https://ww7.readsnk.com/js')
        .replace(/(https:\/\/.*\/chapter\/)(.+)([0-9]+)"/g, '/chapter/$2$3"')
      options.resolve(htmlData)
    })
    .catch(err => {
      options.reject({ url, error: err.message })
    })
}

module.exports = {
  fetchAndModifiy
}
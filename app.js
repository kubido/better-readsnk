const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000

const { setScrapeUrl, responseHandler } = require('./middlewares')

// set scrapping request url
app.use(setScrapeUrl)

// Make request to readsnk.com based on request.url
// set req.htmlData
app.use(responseHandler)


app.listen(PORT, () => console.log('server started at port ' + PORT))
const express = require('express');
const path = require('path');
const compression = require('compression')

// setup serve static file
const app = express();
app.use(compression());
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname + '/public')))

// app.get('/', (req, res) => res.send(prepareHtml));

app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(port, () => console.log(`YTE-3 export listening at http://localhost:${port}`))
require('dotenv').config();

var express = require('express')
var bodyParser = require('body-parser');
var router = require('./router')

// configure
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.NODE_MUSIC_PORT || 2333;

// start server
app.use('/', router.router);

app.listen(port);
console.log('Start listening on port ' + port)

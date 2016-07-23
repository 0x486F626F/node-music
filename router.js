var express = require('express')

var youtube_mp3 = require('./youtube_mp3')

var router = express.Router();
var static_url = process.env.NODE_MUSIC_STATIC_URL

router.get('/', function(req, res) {
    res.json({ message: 'meow!' });
});

router.route('/dl/youtube').get(function(req, res) {
    title = req.body.title;
    url = req.body.url;
    youtube_mp3.download(url, title, function(filename) {
        console.log('Downloading completed: ' + filename);
        res.redirect(static_url + filename);
    });
});

exports.router = router

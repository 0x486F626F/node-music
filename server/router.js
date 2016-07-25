var express = require('express');
var http = require('http');

var youtube_mp3 = require('./youtube-mp3');
var dbMusic = require('./database').dbMusic;

var router = express.Router();
var static_url = process.env.NODE_MUSIC_STATIC_URL;

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'meow!' });
});

// add music to server and redirect to the file
router.get('/dl/youtube', function(req, res) {
  url = req.param('url');
  title = req.param('title');
  youtube_mp3.download(url, title, function(filename) {
    console.log('Downloading completed: ' + filename);
    mp3_url = static_url + encodeURI(filename);
    res.redirect(mp3_url);
  });
});

// add music to server and return thr url
router.get('/add/youtube', function(req, res) {
  url = req.param('url');
  title = req.param('title');
  youtube_mp3.download(url, title, function(filename, title) {
    console.log('Downloading completed: ' + filename);
    mp3_url = static_url + encodeURI(filename);
    res.json({ "title": title, "url": mp3_url });
  });
});

// return all music files
router.get('/musics', function(req, res) {
  dbMusic.findAll({ attributes: ['title', 'filename'] }).then(function(record) {
    var playlist = []
    record.forEach(function(music) {
      title = music.get('title');
      url = process.env.NODE_MUSIC_STATIC_URL + music.get('filename');
      playlist.push({'title': title, 'url': url});
      if (playlist.length == record.length) { res.json(playlist); }
    });
  });
});

module.exports = router

var fs = require('fs')
var youtube = require('youtube-dl');
var mp3dir = process.env.NODE_MUSIC_MP3_DIR || 'mp3/'
var dbYoutube = require('./database').dbYoutube

function download(url, file, callback) {
  youtube.getInfo(url, [], function(err, info) {
    dbYoutube.findOne({ where: { id: info.id } }).then(function(res) {
      if (res == null) {
        var options = [
          "-f", "bestaudio",
          "--extract-audio",
          "--audio-format", "mp3"
        ]
        var music = youtube(url, options);
        music.on('info', function(info) {
          console.log('Start downloading ' + url);
          filename = (file || info.id) + '.mp3';
          dbYoutube.create({id: info.id, title: info.title, filename: filename});
          music.pipe(fs.createWriteStream(mp3dir + filename));
          callback(filename);
        });
      }
      else {
        filename = res.get('filename');
        console.log('Found file: ' + filename);
        callback(filename);
      }
    });

  });
}

module.exports.download = download

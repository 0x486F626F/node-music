var fs = require('fs')
var youtube = require('youtube-dl');
var mp3dir = process.env.NODE_MUSIC_MP3_DIR || 'mp3/'
var dbMusic = require('./database').dbMusic

function download(url, cus_title, callback) {
  youtube.getInfo(url, [], function(err, info) {
    dbMusic.findOne({ where: { id: info.id } }).then(function(res) {
      if (res == null) {
        var options = [
          "-f", "bestaudio",
          "--extract-audio",
          "--audio-format", "mp3"
        ]
        var music = youtube(url, options);
        music.on('info', function(info) {
          console.log('Start downloading ' + url);
          filename = (cus_title || info.id) + '.mp3';
          dbMusic.create({
            id: info.id, 
            source: 'youtube', 
            title: cus_title || info.title, 
            filename: filename
          });
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

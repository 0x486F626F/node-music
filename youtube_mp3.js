var fs = require('fs')
var youtube = require('youtube-dl');
var mp3dir = process.env.NODE_MUSIC_MP3_DIR || 'mp3/'

function download(url, title, redirect) {
    var options = [
        "-f", "bestaudio",
        "--extract-audio",
        "--audio-format", "mp3"
    ]
    var music = youtube(url, options);
    music.on('info', function(info) {
        console.log('Start downloading ' + url);
        filename = (title || info.title) + '.mp3';
        music.pipe(fs.createWriteStream(mp3dir + filename));
        redirect(filename);
    });
}

exports.download = download

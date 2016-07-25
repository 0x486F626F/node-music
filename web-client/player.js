$(document).ready(function() {
  url = 'http://music.hongbozhang.me/api/musics';
  loadPlaylist(url);
});

var audio;
var tracks;
var current;

function loadPlaylist(url) {
}

function initPlayer() {
  current = 0;
  audio = $('#audio');
  tracks = document.getElementsByClassName('music-url');
  len = tracks.length - 1;
  audio[0].volume = 1;

  load($(tracks[0]), audio[0]);

  $(tracks).click(function(e) {
    e.preventDefault();
    link = $(this);
    play(link, audio[0]);
  });

  audio[0].addEventListener('ended', function(e) {
    if (current === len) {
      current = 0;
      link = tracks[0];
    } else {
      link = tracks[current + 1];
    }
    play($(link), audio[0]);
  });
}

function load(link, player) {
  par = link.parent();
  par.addClass('active').siblings().removeClass('active');
  player.src = link.attr('href');
  current = link.parent().index();
  audio[0].load();
  console.log('Loading ' + link.attr('href'));
}

function play(link, player) {
  load(link, player);
  audio[0].play();
}

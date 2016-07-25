$(document).ready(function() {
  url = 'http://music.hongbozhang.me/api/musics';
  getPlaylist(url);
});

var audio;
var playlist;
var tracks;
var current;
var currentTitle;

function hideAddMusicForm() {
}

function loadPlaylist() {
  $(".playlist")[0].innerHTML = "";
  playlist.forEach(function(value) {
    $(".playlist").append('<div class="music-row list-group-item"><a href="' + value.url +
      '" class="music-url">'
      + value.title + '</a></div>');
  });
}

function getPlaylist(url) {
  var xhr = new XMLHttpRequest();
  playlist = [];
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      playlist = JSON.parse(xhr.response);
      loadPlaylist();
      initPlayer();
    }
  }
  xhr.open('GET', url, true);
  xhr.send(null);
}

function addYoutubeMusic(youtubeURL, title) {
  console.log(URL);
  console.log(title);
  url = 'http://music.hongbozhang.me/api/add/youtube?url=' + youtubeURL;
  if (title.length > 0) {
    url = url + '&title=' + title;
  }
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      response = JSON.parse(xhr.response);
      console.log(response);
      playlist.push(response);
      console.log(playlist);
      $('#downloading')[0].style.display = 'none';
      loadPlaylist();
      tracks = document.getElementsByClassName('music-url');
    }
  }
  xhr.open('GET', url, true);
  xhr.send(null);
}

$('#ctrl-btn-show-add-form').click(function() {
  $('#add-music-form')[0].style.display = 'block';
});

$('#ctrl-btn-hide-add-form').click(function() {
  $('#add-music-youtube-url')[0].value = "";
  $('#add-music-title')[0].value = "";
  $('#add-music-form')[0].style.display = 'none';
});

$('#ctrl-btn-next').click(function() {
  playNext();
});

$('#ctrl-btn-last').click(function() {
  playLast();
});

$('#ctrl-btn-shuffle').click(function() {
  shuffle(playlist);
  loadPlaylist();
  tracks = document.getElementsByClassName('music-url');
  play(tracks[0], audio[0]);
});

$('#ctrl-btn-add-music').click(function() {
  $('#downloading')[0].style.display = 'block';
  url = $('#add-music-youtube-url')[0].value;
  title = $('#add-music-title')[0].value;
  addYoutubeMusic(url, title);
  $('#add-music-youtube-url')[0].value = "";
  $('#add-music-title')[0].value = "";
  $('#add-music-form')[0].style.display = 'none';
});

function initPlayer() {
  current = 0;
  audio = $('#audio');
  currentTitle = $('#current-title');
  tracks = document.getElementsByClassName('music-url');
  audio[0].volume = 1;
  $('#add-music-form')[0].style.display='none';
  $('#downloading')[0].style.display = 'none';


  load(tracks[0], audio[0]);

  $(tracks).click(function(e) {
    e.preventDefault();
    play(this, audio[0]);
  });

  audio[0].addEventListener('ended', function(e) {
    playNext();
  });
}

function load(link, player) {
  $(link).parent().addClass('active').siblings().removeClass('active');
  player.src = $(link).attr('href');
  current = $(link).parent().index();
  currentTitle.text(link.text);
  player.load();
  console.log('Loading ' + player.src);
}

function play(link, player) {
  load(link, player);
  player.play();
}

function playNext() {
  play(tracks[(current + 1) % tracks.length], audio[0]);
}

function playLast() {
  play(tracks[(current - 1 + tracks.length) % tracks.length], audio[0]);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


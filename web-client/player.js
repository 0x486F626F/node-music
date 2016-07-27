APIURL = 'http://music.mathematician.engineer/api';

var currentIndex;
var playlist;
var player;
var tracks;

function reloadPlaylist() {
  $("#playlist")[0].innerHTML = "";
  cnt = playlist.length;
  playlist.forEach(function(value) {
    $("#playlist").append('<div class="music-row list-group-item"><a href="' + 
      value.url + '" class="music-url">' + value.title + '</a></div>');
  cnt -= 1;
  if (cnt == 0) {
    tracks = $('.music-url'); 
    $(tracks).click(function(e) {
      e.preventDefault();
      play(this, player);
    });
    if (currentIndex === -1) {
      currentIndex = 0;
      load(tracks[0], player);
    }
  }
  });
}

function getPlaylist(url) {
  xhr = new XMLHttpRequest();
  playlist = [];
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      playlist = JSON.parse(xhr.response);
      reloadPlaylist();
    }
  }
  xhr.open('GET', url, true);
  xhr.send(null);
}

function play(link, player) {
  load(link, player);
  player.play();
}

function load(link, player) {
  $(link).parent().addClass('active').siblings().removeClass('active');
  $('#current-title').text(link.text);
  player.src = $(link).attr('href');
  currentIndex = $(link).parent().index();
  player.load();
}

function playNext() {
  play(tracks[(currentIndex + 1) % tracks.length], player);
}

function playPrevious() {
  play(tracks[(currentIndex - 1 + tracks.length) % tracks.length], player);
}

function setupAutoplay() {
  if (player.duration - player.currentTime < 0.1) {
    parent.playNext();
  }
}

$(document).ready(function() {
  player = $('#audio')[0];
  currentIndex = -1;
  getPlaylist(APIURL + '/musics', reloadPlaylist);
  player.addEventListener('ended', function(e) {
    playNext();
  });
});

// ============================================================================

$('#ctrl-btn-next').click(function() {
  playNext();
});

$('#ctrl-btn-last').click(function() {
  playPrevious();
});

$('#ctrl-btn-shuffle').click(function() {
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
  shuffle(playlist);
  reloadPlaylist();
  play(tracks[0], player);
});

$('#ctrl-btn-show-add-form').click(function() {
  $('#add-music-form')[0].style.display = 'block';
});

$('#ctrl-btn-hide-add-form').click(function() {
  $('#add-music-youtube-url')[0].value = "";
  $('#add-music-title')[0].value = "";
  $('#add-music-form')[0].style.display = 'none';
});

$('#ctrl-btn-add-music').click(function() {
  function addYoutubeMusic(youtubeURL, title) {
    url = APIURL + '/add/youtube?url=' + youtubeURL;
    if (title.length > 0) {
      url = url + '&title=' + title;
    }
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        $('#downloading')[0].style.display = 'none';
        response = JSON.parse(xhr.response);
        playlist.push(response);
        reloadPlaylist();
      }
    }
    xhr.open('GET', url, true);
    xhr.send(null);
  }
  $('#downloading')[0].style.display = 'block';
  url = $('#add-music-youtube-url')[0].value;
  title = $('#add-music-title')[0].value;
  addYoutubeMusic(url, title);
  $('#add-music-youtube-url')[0].value = "";
  $('#add-music-title')[0].value = "";
  $('#add-music-form')[0].style.display = 'none';
});

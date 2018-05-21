var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var skipping = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '134',
    width: '221',
    playerVars: { 
      'fs': 0, 
      'showinfo': 0,
      'controls': 0,
      'color': 'red',
      'modestbranding': 1,
      'rel': 0,
      'start': 1,
      'playlist': ['dQw4w9WgXcQ']
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  $('#pause').hide();
  $('#play').show();
}

function onPlayerStateChange(event) {
  if(event.data == 1 && skipping == false && window.currentPlaylist != undefined) {
    updateTrackData();
  }
  if(event.data == 1 && skipping == false && window.currentPlaylist == undefined) {
    updateOneTrackData();
  }
  if(event.data == 0) {
    $('#pause').toggle();
    $('#play').toggle();
  }
  if(event.data == 3) {
    skipping = false;
  }
}

function launchNotMail() {
  $('.mail').show();
}

function launchNotiTunes() {
  $('.container').show();
}

function launchNotStickies() {
  $('.stickies').show();
}


$(document).ready(function() {

  var form = $('.contactForm'),
      name = $('.contactName'),
      email = $('.contactEmail'),
      message = $('.contactMessage'),
      formSubmit = $('.mailSend');
  
  // form.on('input', '#email, #subject, #message', function() {
  //   $(this).css('border-color', '');
  //   info.html('').slideUp();
  // });
  
  formSubmit.on('click', function(e) {
    e.preventDefault();
    if(validate()) {
      $.ajax({
        type: "POST",
        url: "mailer.php",
        data: form.serialize(),
        dataType: "json"
      }).done(function(data) {
        if(data.success) {
          name.val('');
          email.val('');
          message.val('');
          $('.mail').hide();
          // info.html('Message sent!').css('color', 'green').slideDown();
        } else {
          // info.html('Could not send mail! Sorry!').css('color', 'red').slideDown();
        }
      });
    }
  });
  
  function validate() {
    var valid = true;
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
    if(!regex.test(email.val())) {
      email.css('border-color', 'red');
      valid = false;
    }
    if($.trim(name.val()) === "") {
      subject.css('border-color', 'red');
      valid = false;
    }
    if($.trim(message.val()) === "") {
      message.css('border-color', 'red');
      valid = false;
    }
    
    return valid;
  }

  $(this).bind("contextmenu", function(e) {
    e.preventDefault();
  });

  $('#dock2').Fisheye({
    maxWidth: 60,
    items: 'a',
    itemsText: 'span',
    container: '.dock-container2',
    itemWidth: 40,
    proximity: 80,
    alignment : 'left',
    valign: 'bottom',
    halign : 'center'
  });

});


$(document).keydown(function(e) {
  switch(event.altKey && e.which) {
    case 32:
      $('#pause').toggle();
      $('#play').toggle();
      if (player.getPlayerState() == 2 || player.getPlayerState() == 5) {
        player.playVideo();
      }
      if (player.getPlayerState() == 1) {
        player.pauseVideo();
      }
      break;
    case 37:
      setTimeout(skipping = true, 500);
      player.seekTo(player.getCurrentTime()-3);
      break;
    case 39:
      setTimeout(skipping = true, 500);
      player.seekTo(player.getCurrentTime()+3);
      break;
    case 38:
      player.setVolume(player.getVolume()+3);
      var newVolume = Math.floor(player.getVolume()/100*90);
      $('#slider').slider({value: newVolume});
      break;
    case 40:
      player.setVolume(player.getVolume()-3);
      var newVolume = Math.floor(player.getVolume()/100*90);
      $('#slider').slider({value: newVolume});
      break;
    case 219:
      if(window.currentPlaylist != undefined){
        skipping = false;
        player.previousVideo();
      }
      break;
    case 221:
      if(window.currentPlaylist != undefined){
        skipping = false;
        player.nextVideo();
      }
      break;
    default: 
      return;
  }
  e.preventDefault();
});


$('#progress').css('width', 0+'%');

function getTimes() {
  var position = player.getCurrentTime();
  var duration = player.getDuration();
  $('#progress').css('width', Math.floor(100*position/duration)+'%');

  var timeString = (position/duration) * duration;
  var timeLeft = duration - Math.floor(position);
  var timeStrMin = Math.floor(timeString/60);
  var timeLeftMin = Math.floor(timeLeft/60);
  if (timeString % 60 < 10){
    var timeStrSec = '0' + Math.floor(timeString % 60);
  } else {
    var timeStrSec = Math.floor(timeString % 60);
  }
  if (timeLeft % 60 < 10){
    var timeLeftSec = '0' + Math.floor(timeLeft % 60);
  } else {
    var timeLeftSec = Math.floor(timeLeft % 60);
  }
  var timeText1 = timeStrMin + ':' + timeStrSec;
  var timeText2 = '-' + timeLeftMin + ':' + timeLeftSec;
  if (timeText1 == "NaN:NaN") {
    timeText1 = "0:00";
  }
  $('#time1').text(timeText1);
  $('#time2').text(timeText2);   
  setTimeout(getTimes, 500);
}


function updateTrackData() {
  var playlistData = window.currentPlaylist['tracks'];
  var playerCurrentIndex = player.getPlaylistIndex();
  var nowPlayingObj = playlistData[playerCurrentIndex];
  recentlyPlayedList['tracks'].push(nowPlayingObj);

  $('.mainText').css('background', 'none');
  $('#trackName').html(nowPlayingObj.title);
  $('#artistAlbum').html(nowPlayingObj.channelTitle);
  $('#coverArt').attr('style', "background:url('" + nowPlayingObj.thumb + "');");
  $('#play').hide();
  $('#pause').show();
  // gtag('config', 'UA-118583968-1', {'page_path': "/?playlist='" + window.currentPlaylist['name'] + "'&title='"+nowPlayingObj.title + "'&id='" + nowPlayingObj.id + "'"});
  getTimes();
}

function updateOneTrackData() {
  if($('#trackName').html() == ""){
    var track = player.getVideoData();
    $('.mainText').css('background', 'none');
    $('#trackName').html(track['title']);
    $('#artistAlbum').html(track['author']);
    // gtag('config', 'UA-118583968-1', {'page_path': "/?title='" + track['title'] + "'&id='" + track['video_id'] + "'"});
    getTimes();
  }
}


$('#previous').click(function() { 
  var currentTime = player.getCurrentTime();
  var playlistCheck = player.getPlaylist();
  if(currentTime < 5 && playlistCheck != null){
    player.previousVideo();
  } else {
    player.seekTo(0);
  }
});

$('#play').click(function() { 
  player.playVideo();
  $('#play').hide();
  $('#pause').show();
});

$('#pause').click(function() { 
  player.pauseVideo();
  $('#pause').hide();
  $('#play').show();
});

$('#next').click(function() {
  var playlistCheck = player.getPlaylist();
  if(playlistCheck != null){
    player.nextVideo();
  } else {
    player.seekTo(player.getCurrentTime() + 3); 
  }
});

$(".container").draggable({
  handle: ".topBar",
  delay: 300
});

$(".about-popup").draggable({
  handle: ".popup-top",
  delay: 300
});

$(".mail").draggable({
  handle: ".mail-top",
  delay: 300
});

$(".stickies").draggable({
  handle: ".handle",
  delay: 300
});

// $(".stickies .handle").dblclick(function(){
//   $(this).parent().find(".main").hide();
//   $(this).parent().closest(".stickies").toggleClass("stickies-shadow");
// });

$(".stickies img").click(function(){
  $(this).closest(".stickies").hide();
});

function setVolume(volume) {
  player.setVolume(volume);
};

$('#slider').slider({
  min: 0,
  max: 90,
  value: 65,
  slide: function(event, ui) {
    setVolume(Math.floor(ui.value/90*100));
  }
});

$('#scrobble').slider({
  orientation: "horizontal",
  range: "min",
  max: 100,
  value: 20
});

var repeatImg = ['images/repeat-off.jpg', 'images/repeat-all.jpg']; //'images/repeat-one.jpg'
var clickImg = 0;
var loop = false;

function setRepeatImg(){
  $("#repeatContainer img").click(changeImage);
}

function changeImage(){
  if(typeof(currentPlaylist) == 'object'){
    if (clickImg == 1){
      clickImg = 0;
    } else {
      clickImg = 1;
    }
    img = repeatImg[clickImg];
    $("#repeatContainer img").attr("src", img);
    player.setLoop(!loop);
  }
}

setRepeatImg();

var shuffle = false;

$('#shuffleContainer img').click(function(){
  if(typeof(currentPlaylist) == 'object'){
    $('#shuffleContainer img').toggle();
    player.setShuffle(!shuffle);
  }
});

function getDateString(){
  var d = new Date();
  var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var dateString = weekday[d.getDay()];
  var timeHr = d.getHours();
  var timeMin = d.getMinutes();
  if (timeHr < 12) {
    var ampm = 'AM';
  } else {
    var ampm = 'PM';
  }
  if (timeHr == 0) {
    timeHr = 12;
  } else if (timeHr >= 13) {
    timeHr = timeHr - 12;
  }
  if (timeMin < 10) {
    timeMin = '0' + timeMin;
  }
  var timeString = timeHr + ':' + timeMin;

  dateString = dateString + ' ' + timeString + ' ' + ampm;
  $('#date').text(dateString);
  setTimeout(getDateString, 5000);
};

getDateString();

$('.app-name').click(function(){
  $('.app-name').toggleClass("app-name-over");
  $('.menu-popup').toggle();
});

$.fn.center = function() {
  this.css("position","absolute");
  this.css("top", ( jQuery(window).height() - this.height() ) / 2+jQuery(window).scrollTop() + "px");
  this.css("left", ( jQuery(window).width() - this.width() ) / 2+jQuery(window).scrollLeft() + "px");
  return this;
};

$('.menu-popup .text').click(function(){
  $('.app-name').toggleClass("app-name-over");
  $('.menu-popup').toggle();
  $('.about-popup').center();
  $('.about-popup').toggle();
});

$('.popup-top img:first-child')
  .mouseover(function() { 
    $(this).attr("src", "images/btn-red-over.jpg");
  })
  .mouseout(function() {
    $(this).attr("src", "images/btn-red.jpg");
  });

$('.popup-top img:first-child').click(function(){
  $('.about-popup').toggle();
});

$('.mail-top img.redBtn')
  .mouseover(function() { 
    $(this).attr("src", "images/btn-red-over.jpg");
  })
  .mouseout(function() {
    $(this).attr("src", "images/btn-red.jpg");
  });

$('.mail-top img.redBtn').click(function(){
  $('.mail').toggle();
});

$('#iTunesWinBtns img:first-child')
  .mouseover(function() { 
    $(this).attr("src", "images/main-btn-red-over.jpg");
  })
  .mouseout(function() {
    $(this).attr("src", "images/main-btn-red.jpg");
  });

$('#iTunesWinBtns img:first-child').click(function(){
  $('.container').toggle();
});


var App = angular.module('RdioApp', ['ngDragDrop']);

App.controller('TrackController', function($scope, $http){

  $scope.playlists = [
    recentlyPlayedList, 
    iTunesHTMLPlaylist, 
    wysPlaylist,
    eraserheadPlaylist, 
    ninetiesHousePlaylist, 
    slowJamsPlaylist,
    filamOPMPlaylist,
    adultContemporaryPlaylist,
    shermervillePlaylist,
    early80sPlaylist,
    abbaGoldPlaylist,
    wonderYearsPlaylist,
    newEditionStoryPlaylist, 
    cobrakaiPlaylist 
  ];

  $scope.searchResults = iTunesHTMLPlaylist['tracks'];

  $scope.submit = function(){
    gapi.client.setApiKey(apiKey);
    gapi.client.load('youtube', 'v3', function() {

      var q = $('#searchField').val();
      // gtag('config', 'UA-118583968-1', {'page_path': "/?q='"+q+"'"});
      $scope.selectedPL = "";

      var request = gapi.client.youtube.search.list({
        q: q,
        maxResults: 1,
        type: 'video',
        videoCategoryId: 10,
        part: 'snippet',
        videoEmbeddable: true   
      }).then(function(response) {
        if(response.result.pageInfo.totalResults != 0) {
          return response.result.items[0].id.videoId; // just an id
        }
      }).then(function(vidId) {
        return gapi.client.youtube.videos.list({
          part: 'snippet,statistics,contentDetails',
          id: vidId
        });
      }).then(function(response) { 
        var returnObj = {};
        console.log(response.result.items);
        if(response.result.pageInfo.totalResults != 0) {
          returnObj['id'] = response.result.items[0].id;
          returnObj['title'] = response.result.items[0].snippet.title;
          returnObj['channelTitle'] = response.result.items[0].snippet.channelTitle;
          returnObj['thumb'] = response.result.items[0].snippet.thumbnails.default.url;
          returnObj['publishedAt'] = response.result.items[0].snippet.publishedAt;
          returnObj['duration'] = response.result.items[0].contentDetails.duration;
          returnObj['viewCount'] = response.result.items[0].statistics.viewCount;
          returnObj['likeCount'] = response.result.items[0].statistics.likeCount;
          returnObj['dislikeCount'] = response.result.items[0].statistics.dislikeCount;
        }
        return returnObj;
      }).then(function(returnObj) {
        console.log(returnObj);
        $scope.$apply(function() {
          $scope.searchResults = [returnObj];
        });
      });

    });
  };

  $scope.setMaster = function(song){
    $scope.selected = song;
    $scope.selectedPL = "";
  };

  $scope.isSelected = function(song){
    return $scope.selected === song;
  };

  $scope.setMasterPL = function(playlist){
    $scope.selectedPL = playlist;
    $scope.searchResults = playlist['tracks'];
  };

  $scope.isSelectedPL = function(playlist){
    return $scope.selectedPL === playlist;
  };


  // $scope.addThis = function(){
  //   var newSong = $scope.playlist[$scope.playlist.length-1].id;
  //   playlistArray.unshift(newSong);

// for new playlist
// a = player.getPlaylist();
// a.push('dQw4w9WgXcQ');
// b = player.getPlaylistIndex();
// player.pauseVideo();
// c = player.getCurrentTime();
// player.loadPlaylist(a);
// player.playVideoAt(b);
// player.seekTo(c);

  // };

  $scope.dblClicked = function(){
    window.currentPlaylist = undefined;
    $('.mainText').css('background', 'none');
    $('#trackName').html($scope.selected.title);
    $('#artistAlbum').html($scope.selected.channelTitle);
    $('#coverArt').attr('style', "background:url('" + $scope.selected.thumb + "');");
    player.loadVideoById($scope.selected.id);
    recentlyPlayedList['tracks'].push($scope.selected);
    $('#play').hide();
    $('#pause').show();
    // gtag('config', 'UA-118583968-1', {'page_path': "/?title='" + $scope.selected.title + "'&id='" + $scope.selected.id + "'"});
    getTimes();
  };

  $scope.dblClickedPL = function(playlist){
    window.currentPlaylist = playlist;
    var allTrackIDs = [];
    var tracks = playlist['tracks'];
    for(i=0;i<tracks.length;i++){
      allTrackIDs.push(tracks[i]['id']);
    }
    player.loadPlaylist(allTrackIDs);
    // gtag('config', 'UA-118583968-1', {'page_path': "/?playlist='" + playlist['name'] + "'"});
  };

});


App.filter('convertYTDuration', function() {

  return function(string) {
    if (string != undefined) {
      var tString = string.replace('H', ':').replace('M', ':').replace('PT', '').replace('S', '');
      var tArray = tString.split(":");

        if(tArray.length == 1) {
          tArray.unshift("0");
        }

        if(tArray.length > 1) {
          var minutes = tArray[tArray.length-2];
          if(minutes.length == 1 && tArray.length == 3){
            tArray[tArray.length-2] = '0' + minutes;
          }
          var seconds = tArray[tArray.length-1];
          if(seconds.length == 1){
            tArray.pop();
            tArray.push('0' + seconds);
          }
          if(seconds.length == 0){
            tArray.pop();
            tArray.push('00');
          }
        }

      return tArray.join(":");
    } else {
      return '';
    }
  }

});


App.filter('convertYTDate', function() {

  return function(string) {
    if (string != undefined) {
      var ytArr = string.split("T")[0].split("-");
      ytArr.push(ytArr.shift());
      if(ytArr[0][0] == '0'){
        ytArr[0] = ytArr[0][1];
      }
      if(ytArr[1][0] == '0'){
        ytArr[1] = ytArr[1][1];
      }
      return ytArr.join("/");
    } else {
      return '';
    }
  }

});


App.filter('truncatePlays', function() {

  return function(string) {
    if(string.length > 9) {
      playsAbbreviated = string[0]+'.'+string[1]+'bil';
      return playsAbbreviated;
    } else {
      return string;
    }
  }

});
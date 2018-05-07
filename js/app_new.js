var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
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
  if(event.data == 0) {
    // togglePlay();
  }
}

$('#progress').css('width', 0+'%');

var playlistArray = [];

function getTimes(){
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

$('#previous').click(function() { 
  // $('#api').rdio().previous(); 
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
  // $('#api').rdio().next(); 
});

$(".container").draggable({
  handle: ".topBar",
  delay: 300
});

function setVolume(volume) {
  player.setVolume(volume);
};

$('#slider').slider({
  min: 0,
  max: 82,
  value: 65,
  slide: function(event, ui) {
    setVolume(Math.floor(ui.value/82*100));
  }
});

$('#scrobble').slider({
  orientation: "horizontal",
  range: "min",
  max: 100,
  value: 20
});

var repeatImg = ['images/repeat-off.jpg', 'images/repeat-one.jpg', 'images/repeat-all.jpg'];
var clickImg = 0;

function setRepeatImg(){
  $("#repeatContainer img").click(changeImage);
}

function changeImage(){
  if (clickImg == 2){
    clickImg = 0;
  } else {
    clickImg++;
  }
  img = repeatImg[clickImg];
  $("#repeatContainer img").attr("src", img);
  // $("#api").rdio().setRepeat(clickImg);
}

setRepeatImg();

var toggle = 0;

$('#shuffleContainer img').click(function(){
  if (toggle == 0){
    toggle = 1;
  } else {
    toggle = 0;
  }
  $('#shuffleContainer img').toggle();
  // $("#api").rdio().setShuffle(toggle);
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



var App = angular.module('RdioApp', ['ngDragDrop']);

App.controller('TrackController', function($scope, $http){

  $scope.playlist = [];

  $scope.searchResults = [
    {id: "dQw4w9WgXcQ", title: "Rick Astley - Never Gonna Give You Up", thumb: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg"},
    {id: "8UVNT4wvIGY", title: "Gotye - Somebody That I Used To Know", thumb: "https://i.ytimg.com/vi/8UVNT4wvIGY/default.jpg"},
    {id: "sENM2wA_FTg", title: "Imagine Dragons - It's Time", thumb: "https://i.ytimg.com/vi/sENM2wA_FTg/default.jpg"},
    {id: "C-dvTjK_07c", title: "Usher - DJ Got Us Fallin' in Love", thumb: "https://i.ytimg.com/vi/C-dvTjK_07c/default.jpg"},
    {id: "U5rLz5AZBIA", title: "Timbaland - The Way I Are", thumb: "https://i.ytimg.com/vi/U5rLz5AZBIA/default.jpg"},
    {id: "oG08ukJPtR8", title: "Michael Jackson & Justin Timberlake - Love Never Felt so Good", thumb: "https://i.ytimg.com/vi/oG08ukJPtR8/default.jpg"},
    {id: "OPf0YbXqDm0", title: "Mark Ronson feat. Bruno Mars - Uptown Funk", thumb: "https://i.ytimg.com/vi/OPf0YbXqDm0/default.jpg"},
    {id: "rog8ou-ZepE", title: "Vanilla Ice - Ice Ice Baby", thumb: "https://i.ytimg.com/vi/rog8ou-ZepE/default.jpg"},
    {id: "9bZkp7q19f0", title: "Psy - Gangnam Style (강남스타일)", thumb: "https://i.ytimg.com/vi/9bZkp7q19f0/default.jpg"} 
  ];

  $scope.submit = function(){
    gapi.client.setApiKey("AIzaSyD89Rr5p7H20AI-YqPIDS5AxTEWNwWwDd4");
    gapi.client.load('youtube', 'v3', function() {

      var q = $('#searchField').val();
      // gtag('config', 'UA-118583968-1', {'page_path': "/?q='"+q+"'"});

      var request = gapi.client.youtube.search.list({
        q: q,
        maxResults: 5,
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
  }

  $scope.setMaster = function(song){
    $scope.selected = song;
  }

  $scope.isSelected = function(song){
    return $scope.selected === song;
  }

  $scope.addThis = function(){
    var newSong = $scope.playlist[$scope.playlist.length-1].id;
    playlistArray.unshift(newSong);
  }

  $scope.dblClickedPlay = function(){
    $('.mainText').css('background', 'none');
    $('#trackName').html($scope.selected.title);
    $('#artistAlbum').html($scope.selected.channelTitle);
    $('#coverArt').attr('style', "background:url('" + $scope.selected.thumb + "');");
    player.loadVideoById($scope.selected.id);
    $('#play').hide();
    $('#pause').show();
    getTimes();
  };  

  $scope.dblClicked = function(){
    $('.mainText').css('background', 'none');
    $('#trackName').html($scope.selected.title);
    $('#artistAlbum').html($scope.selected.channelTitle);
    $('#coverArt').attr('style', "background:url('" + $scope.selected.thumb + "');");
    player.loadVideoById($scope.selected.id);
    $('#play').hide();
    $('#pause').show();
    getTimes();
  };
});
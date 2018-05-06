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

// var playStatus = 0;

// $('#api').bind('playStateChanged.rdio', function(e, playState) {
//   if (playState == 0) { // paused
//     $('#play').show();
//     $('#pause').hide();
//   } else {
//     $('#play').hide();
//     $('#pause').show();
//   }
//   if (playState == 3) {
//     $('#trackName').text('** Buffering **');
//     $('#artistAlbum').text('Please Wait');
//   } else {
//     $('#trackName').text(trackName);
//     $('#artistAlbum').text(artistAlbum);
//   }

//   playStatus = playState; // for use elsewhere
// });

// $('#api').bind('queueChanged.rdio', function(e, newQueue) {
//   console.log('----------')
//   console.log('newQueue', newQueue);
//   console.log('songs in cue: ' + newQueue.length);
//   var newQueueNote = [];
//   for(i=0; i<newQueue.length; i++){
//     newQueueNote.push(newQueue[i].key);
//   }
//   console.log('newQueue Note: ' + newQueueNote);
// });

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


function removeEmptyParams(params) {
  for (var p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}

// function executeRequest(request) {
//   request.execute(function(response) {
//     JSON.stringify(response);
//   });
// }

function buildApiRequest(requestMethod, path, params, properties) {
  params = removeEmptyParams(params);
  var request;
  if (properties) {
    var resource = createResource(properties);
    request = gapi.client.request({
        'body': resource,
        'method': requestMethod,
        'path': path,
        'params': params
    });
  } else {
    request = gapi.client.request({
        'method': requestMethod,
        'path': path,
        'params': params
    });
  }

  // var vidData = [];

  request.execute(function(response) {
    // vidData.push(response['items'][0]['contentDetails']['duration']);
    // vidData.push(response['items'][0]['statistics']['viewCount']);
    // vidData.push(response['items'][0]['statistics']['likeCount']);
    // vidData.push(response['items'][0]['statistics']['dislikeCount']);
    console.log('response: ' + response);
    // window.reqVar = response;
    // console.log('window.reqVar: ' + window.reqVar);
  });

  // setTimeout(function(){ 
  //   return vidData;
  // }, 2000);
}



var App = angular.module('RdioApp', ['ngDragDrop']);

App.controller('TrackController', function($scope, $http){

  $scope.playlist = [];

  $scope.searchResults = [
    {id: "dQw4w9WgXcQ", name: "Rick Astley - Never Gonna Give You Up", thumb: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg"},
    {id: "8UVNT4wvIGY", name: "Gotye - Somebody That I Used To Know", thumb: "https://i.ytimg.com/vi/8UVNT4wvIGY/default.jpg"},
    {id: "sENM2wA_FTg", name: "Imagine Dragons - It's Time", thumb: "https://i.ytimg.com/vi/sENM2wA_FTg/default.jpg"},
    {id: "C-dvTjK_07c", name: "Usher - DJ Got Us Fallin' in Love", thumb: "https://i.ytimg.com/vi/C-dvTjK_07c/default.jpg"},
    {id: "U5rLz5AZBIA", name: "Timbaland - The Way I Are", thumb: "https://i.ytimg.com/vi/U5rLz5AZBIA/default.jpg"},
    {id: "oG08ukJPtR8", name: "Michael Jackson & Justin Timberlake - Love Never Felt so Good", thumb: "https://i.ytimg.com/vi/oG08ukJPtR8/default.jpg"},
    {id: "OPf0YbXqDm0", name: "Mark Ronson feat. Bruno Mars - Uptown Funk", thumb: "https://i.ytimg.com/vi/OPf0YbXqDm0/default.jpg"},
    {id: "rog8ou-ZepE", name: "Vanilla Ice - Ice Ice Baby", thumb: "https://i.ytimg.com/vi/rog8ou-ZepE/default.jpg"},
    {id: "9bZkp7q19f0", name: "Psy - Gangnam Style (강남스타일)", thumb: "https://i.ytimg.com/vi/9bZkp7q19f0/default.jpg"} 
  ];

  $scope.submit = function(){
    // $http.get('http://rdio-service.herokuapp.com/search?q=%27'+ $('#searchField').val() + '%27&types[]=track')
    //   .success(function(data){
    //     var filteredTracks = data.data;
    //     var filterKeywords = ['karaoke', 'as made famous', 'made famous by', 'in style of', 'in the style of', 'originally performed by', 'cover by'];
    //     for(i=0; i<filterKeywords.length; i++){
    //       filteredTracks = _.filter(filteredTracks, function(track){ return track.name.toLowerCase().indexOf(filterKeywords[i]) == -1; });
    //     }

    //     _.each(filteredTracks, function(song){ 
    //       $http.get('http://rdio-service.herokuapp.com/tracks/' + song.id)
    //         .success(function(data){
    //           song.artist = data.data.artist;
    //           song.album = data.data.album;
    //           var songTime = data.data.duration;
    //           var songMins = Math.floor(songTime/60);
    //           var songSeconds = songTime % 60;
    //           if (songSeconds < 10) {
    //             songSeconds = '0' + songSeconds;
    //           }
    //           song.duration = songMins + ':' + songSeconds;
    //         })
    //         .error(function(data){
    //           song.artist = '{{ query hiccup }}';
    //           song.album = '{{ still playable }}';
    //           song.duration = '???';
    //         })
    //     });

    //     $scope.searchResults = filteredTracks;
        
      // });
    gapi.client.setApiKey('AIzaSyD89Rr5p7H20AI-YqPIDS5AxTEWNwWwDd4');
    gapi.client.load('youtube', 'v3', function() {

      var q = $('#searchField').val();
      console.log(q);
      ga('set', 'page', '/?q='+q;
      ga('send', 'pageview');

      var request = gapi.client.youtube.search.list({
        q: q,
        maxResults: 20,
        type: 'video',
        videoCategoryId: 10,
        part: 'snippet',
        videoEmbeddable: true                     
      });

      var filteredTracks = [];

      request.execute(function(response) {
        var str = JSON.stringify(response.result['items']);
        var data = JSON.parse(str);
        // console.log(data);

        for(i=0; i<data.length; i++) {
          var vidId = data[i]['id']['videoId'];
          var vidTitle = data[i]['snippet']['title'];
          var vidThumb = data[i]['snippet']['thumbnails']['default']['url'];
          var vidTitle = data[i]['snippet']['title'];
          filteredTracks.push({id: vidId, name: vidTitle, thumb: vidThumb});
        }

        // console.log('filteredTracks' + JSON.stringify(filteredTracks));
      });

      _.each(filteredTracks, function(song){
        // console.log('song:' + song);
        var vData = buildApiRequest(
          'GET', 
          '/youtube/v3/videos', 
          {'id': song['id'], 'part': 'contentDetails,statistics'}
        );
        console.log('vidData: ' + vData);
      });


      $scope.searchResults = filteredTracks;
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
    $('#trackName').html($scope.selected.name);
    $('#coverArt').attr('style', "background:url('" + $scope.selected.thumb + "');");
    player.loadVideoById($scope.selected.id);
    $('#play').hide();
    $('#pause').show();
    getTimes();
  };  

  $scope.dblClicked = function(){
    $('.mainText').css('background', 'none');
    $('#trackName').html($scope.selected.name);
    $('#coverArt').attr('style', "background:url('" + $scope.selected.thumb + "');");
    player.loadVideoById($scope.selected.id);
    $('#play').hide();
    $('#pause').show();
    getTimes();
  };
});
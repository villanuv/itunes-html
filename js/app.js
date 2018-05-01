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
      'rel': 0
    }, 
    //videoId: 'M7lc1UVf-VE',
    events: {
      //'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  if(event.data == 0) {
    togglePlay();
  }
}

$('#progress').css('width', 0+'%');

var playlistArray = [];

// $('#api').bind('playingTrackChanged.rdio', function(e, playingTrack, sourcePosition) {
//   if (playingTrack) {
//     duration = playingTrack.duration;
//     trackID = playingTrack.key;
//     trackName = playingTrack.name;
//     artistAlbum = playingTrack.artist + " \u2014 " + playingTrack.album;
//     // timeMin = Math.floor(duration / 60);
//     // timeSec = duration % 60;
//     // if (timeSec < 10) {
//     //   timeSec = '0' + timeSec;
//     // }
//     $('#coverArt').attr('style', "background:url('" + playingTrack.icon + "');");
//     $('#coverArt').attr('alt', "Cover Art: " + playingTrack.album);
//     $('#trackName').text(trackName);
//     $('#artistAlbum').text(artistAlbum);
//     // $('#time2').text(timeMin + ':' + timeSec);
//     console.log('----------')
//     console.log('sourcePosition: ' + sourcePosition);
//     console.log('Currently Playing: ' + trackName + ' (' + playingTrack.artist + ')');

//     console.log('key: ' + trackID);

//     if ($('#artistAlbum')[0].scrollWidth > $('#artistAlbum').innerWidth()){
//       // $('#trackName').addClass('scrollThis');
//       $('#artistAlbum').addClass('scrollThis');
//     }

//     // $('#time2').click(function(){
//     //   $('#time2').text(timeMin + ':' + timeSec);
//     // });
//   }

// });

// $('#api').bind('positionChanged.rdio', function(e, position) {
//   $('#progress').css('width', Math.floor(100*position/duration)+'%');
//   var timeString = (position/duration) * duration;
//   var timeLeft = duration - Math.floor(position);
//   var timeStrMin = Math.floor(timeString/60);
//   var timeLeftMin = Math.floor(timeLeft/60);
//   if (timeString % 60 < 10){
//     var timeStrSec = '0' + Math.floor(timeString % 60);
//   } else {
//     var timeStrSec = Math.floor(timeString % 60);
//   }
//   if (timeLeft % 60 < 10){
//     var timeLeftSec = '0' + Math.floor(timeLeft % 60);
//   } else {
//     var timeLeftSec = Math.floor(timeLeft % 60);
//   }
//   var timeText1 = timeStrMin + ':' + timeStrSec;
//   var timeText2 = '-' + timeLeftMin + ':' + timeLeftSec;
//   $('#time1').text(timeText1);
//   $('#time2').text(timeText2); 

//   // if (timeLeft == 1){
//   //   $('#api').rdio().queue(trackID);
//   // }

// });

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

// $('#api').rdio('FhhVpNKPABJQ_FRDTXEzbzQtME5xVHZkWGtvWFJwYndpdHVuZXMtaHRtbC52aWxsYW51di5jb22qVYpWlKJZfh-hf_nFvBtq');
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
  // $('#api').rdio().setVolume(volume);
};

$('#slider').slider({
  min: 0,
  max: 82,
  value: 35,
  slide: function(event, ui) {
    setVolume(ui.value/100);
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
    {id: "8UVNT4wvIGY", name: "Gotye - Somebody That I Used To Know"},
    {id: "sENM2wA_FTg", name: "Imagine Dragons - It's Time"},
    {id: "C-dvTjK_07c", name: "Usher - DJ Got Us Fallin' in Love"},
    {id: "U5rLz5AZBIA", name: "Timbaland - The Way I Are"},
    {id: "oG08ukJPtR8", name: "Michael Jackson & Justin Timberlake - Love Never Felt so Good"},
    {id: "OPf0YbXqDm0", name: "Mark Ronson feat. Bruno Mars - Uptown Funk"},
    {id: "rog8ou-ZepE", name: "Vanilla Ice - Ice Ice Baby"},
    {id: "9bZkp7q19f0", name: "Psy - Gangnam Style (강남스타일)"} 
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
      var request = gapi.client.youtube.search.list({
        q: q,
        maxResults: 20,
        type: 'video',
        videoCategoryId: 10,
        part: 'snippet',
        videoEmbeddable: true                     
      });

      request.execute(function(response) {
        var filteredTracks = [];
        var str = JSON.stringify(response.result['items']);
        var data = JSON.parse(str);

        for(i=0; i<data.length; i++) {
          var vidId = data[i]['id']['videoId'];
          var vidTitle = data[i]['snippet']['title'];
          // $('#search-results').append('<a href="#" onclick="playVideo(\'' + vidId + '\');">' + vidTitle + '</a><br>');
          filteredTracks.push({id: vidId, name: vidTitle});
        }

        console.log(filteredTracks);
        $scope.searchResults = filteredTracks;
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
    player.loadVideoById($scope.selected.id);
  };  

  $scope.dblClicked = function(){
    $('.mainText').css('background', 'none');
    $('#trackName').html($scope.selected.name);
    player.loadVideoById($scope.selected.id);
  };
});
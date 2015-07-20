$('#progress').css('width', 0+'%');
$('#api').bind('ready.rdio', function() {
  var songArray = ['t2734348', 't2615942', 't2330404', 't21950691', 't15337562', 't10893360', 't2885987'];
  var randomPick = songArray[Math.floor(Math.random() * songArray.length)];
  $('.mainText').css('background', 'none');
  $(this).rdio().play('p13794130');
});

var playlistArray = [];

$('#api').bind('playingTrackChanged.rdio', function(e, playingTrack, sourcePosition) {
  if (playingTrack) {
    duration = playingTrack.duration;
    trackID = playingTrack.key;
    trackName = playingTrack.name;
    artistAlbum = playingTrack.artist + " \u2014 " + playingTrack.album;
    // timeMin = Math.floor(duration / 60);
    // timeSec = duration % 60;
    // if (timeSec < 10) {
    //   timeSec = '0' + timeSec;
    // }
    $('#coverArt').attr('style', "background:url('" + playingTrack.icon + "');");
    $('#coverArt').attr('alt', "Cover Art: " + playingTrack.album);
    $('#trackName').text(trackName);
    $('#artistAlbum').text(artistAlbum);
    // $('#time2').text(timeMin + ':' + timeSec);
    console.log('----------')
    console.log('sourcePosition: ' + sourcePosition);
    console.log('Currently Playing: ' + trackName + ' (' + playingTrack.artist + ')');

    console.log('key: ' + trackID);

    if ($('#artistAlbum')[0].scrollWidth > $('#artistAlbum').innerWidth()){
      // $('#trackName').addClass('scrollThis');
      $('#artistAlbum').addClass('scrollThis');
    }

    // $('#time2').click(function(){
    //   $('#time2').text(timeMin + ':' + timeSec);
    // });
  }

});

$('#api').bind('positionChanged.rdio', function(e, position) {
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
  $('#time1').text(timeText1);
  $('#time2').text(timeText2); 

  // if (timeLeft == 1){
  //   $('#api').rdio().queue(trackID);
  // }

});

var playStatus = 0;

$('#api').bind('playStateChanged.rdio', function(e, playState) {
  if (playState == 0) { // paused
    $('#play').show();
    $('#pause').hide();
  } else {
    $('#play').hide();
    $('#pause').show();
  }
  if (playState == 3) {
    $('#trackName').text('** Buffering **');
    $('#artistAlbum').text('Please Wait');
  } else {
    $('#trackName').text(trackName);
    $('#artistAlbum').text(artistAlbum);
  }

  playStatus = playState; // for use elsewhere
});

$('#api').bind('queueChanged.rdio', function(e, newQueue) {
  console.log('----------')
  console.log('newQueue', newQueue);
  console.log('songs in cue: ' + newQueue.length);
  var newQueueNote = [];
  for(i=0; i<newQueue.length; i++){
    newQueueNote.push(newQueue[i].key);
  }
  console.log('newQueue Note: ' + newQueueNote);
});

$('#api').rdio('FhhVpNKPABJQ_FRDTXEzbzQtME5xVHZkWGtvWFJwYndpdHVuZXMtaHRtbC52aWxsYW51di5jb22qVYpWlKJZfh-hf_nFvBtq');
$('#previous').click(function() { $('#api').rdio().previous(); });
$('#play').click(function() { $('#api').rdio().play(); });
$('#pause').click(function() { $('#api').rdio().pause(); });
$('#next').click(function() { $('#api').rdio().next(); });

$(".container").draggable({
  handle: ".topBar",
  delay: 300
});

function setVolume(volume) {
  $('#api').rdio().setVolume(volume);
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
  $("#api").rdio().setRepeat(clickImg);
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
  $("#api").rdio().setShuffle(toggle);
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
{id: "t15061212", artist: "Gotye", name: "Somebody That I Used To Know", album: "Making Mirrors", duration: "4:05"},
{id: "t20005759", artist: "Imagine Dragons", name: "It's Time", album: "Night Visions", duration: "3:58"},
{id: "t4615015", artist: "Usher", name: "DJ Got Us Fallin' in Love", album: "Raymond v Raymond (Deluxe Edition)", duration: "3:42"},
{id: "t2749381", artist: "Timbaland", name: "The Way I Are", album: "Shock Value", duration: "2:59"},
{id: "t48214355", artist: "Michael Jackson", name: "Love Never Felt so Good", album: "XSCAPE", duration: "4:06"},
{id: "t58776832", artist: "Mark Ronson", name: "Uptown Funk", album: "Uptown Funk", duration: "4:30"}, 
{id: "t2575330", artist: "Vanilla Ice", name: "Ice Ice Baby", album: "To The Extreme", duration: "4:31"}, 
{id: "t20652375", duration: "3:39", album: "Gangnam Style (강남스타일)", name: "Gangnam Style (강남스타일)", artist: "Psy"}, 
{id: "t2910833", duration: "3:33", album: "Whenever You Need Somebody", name: "Never Gonna Give You Up", artist: "Rick Astley"},
{id: "t2734348", artist: "Yello", name: "Oh Yeah", album: "Stella", duration: "3:06"}
];

  // $scope.searchResults = [];

  $scope.submit = function(){
    $http.get('http://rdio-service.herokuapp.com/search?q=%27'+ $('#searchField').val() + '%27&types[]=track')
      .success(function(data){
        var filteredTracks = data.data;
        var filterKeywords = ['karaoke', 'as made famous', 'made famous by', 'in style of', 'in the style of', 'originally performed by', 'cover by'];
        for(i=0; i<filterKeywords.length; i++){
          filteredTracks = _.filter(filteredTracks, function(track){ return track.name.toLowerCase().indexOf(filterKeywords[i]) == -1; });
        }

        _.each(filteredTracks, function(song){ 
          $http.get('http://rdio-service.herokuapp.com/tracks/' + song.id)
            .success(function(data){
              song.artist = data.data.artist;
              song.album = data.data.album;
              var songTime = data.data.duration;
              var songMins = Math.floor(songTime/60);
              var songSeconds = songTime % 60;
              if (songSeconds < 10) {
                songSeconds = '0' + songSeconds;
              }
              song.duration = songMins + ':' + songSeconds;
            })
            .error(function(data){
              song.artist = '{{ query hiccup }}';
              song.album = '{{ still playable }}';
              song.duration = '???';
            })
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
    $('#api').rdio().queue(newSong);
    playlistArray.unshift(newSong);
    if (($scope.playlist.length == 1) && (playStatus != 1)) {
      $('#api').rdio().play(newSong);
    }
  }

  $scope.dblClickedPlay = function(){
    $('#api').rdio().clearQueue();
    var marker = _.indexOf($scope.playlist, $scope.selected);
    $('.mainText').css('background', 'none');
    $('#api').rdio().play($scope.selected.id);
    
    // case: when dblClicking on middle songs
    var remPlaylist = [];
    for(i=marker+1;i<$scope.playlist.length;i++){
      remPlaylist.push($scope.playlist[i].id);
    }
    remPlaylist.reverse();
    for(i=0;i<remPlaylist.length;i++){
      $('#api').rdio().queue(remPlaylist[i]);
    }

    // case: restarting playlist
    // if ((marker == 0) && (playStatus == 2)) {
    //   var resetPlaylist = [];
    //   for(i=0;i<$scope.playlist.length;i++){
    //     resetPlaylist.push($scope.playlist[i].id);
    //   }
    //   resetPlaylist.reverse();
    //   for(i=0;i<resetPlaylist.length;i++){
    //     $('#api').rdio().queue(resetPlaylist[i]);
    //   }
    // }

  };  

  $scope.dblClicked = function(){
    $('#api').rdio().clearQueue();
    $('.mainText').css('background', 'none');
    $('#api').rdio().play($scope.selected.id);
  };
});
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
  $('.pause').hide();
  $('.play').show();
  $('.not-safari').center();
}

function onPlayerStateChange(event) {
  if(event.data == 1 && isSkipping() == false && player.getPlaylist().length > 1) {
    $('.trackName').css('opacity', 0);
    updateTrackData();
    checkText();
  }
  if(event.data == 1 && isSkipping() == false && window.selected == undefined) {
    $('.trackName').css('opacity', 0);
    // console.log('one track update');
    updateOneTrackData();
    checkText();
  }
  if(event.data == 0) {
    $('.pause').hide();
    $('.play').show();
  }
  if(event.data == 3) {
    $('.trackName').css('opacity', 0);
    checkText();
    // $('.trackName').html("Buffering...");
    // $('.artistAlbum').html("Please wait");
    // $('.mainText').css('background', 'none');
  }
}
  
function updateTrackData() {
  var playlistData = window.currentPlaylist['tracks'];
  var nowPlayingId = player.getVideoData().video_id;
  var allVideoIds = _.map(currentPlaylist.tracks, function (song) { return song.id });
  var nowPlayingIndex = _.indexOf(allVideoIds, nowPlayingId);
  var nowPlayingObj = playlistData[nowPlayingIndex];
  recentlyPlayedList['tracks'].push(nowPlayingObj);
  localStorage.setItem('recentlyPlayedList', JSON.stringify(recentlyPlayedList));

  $('.mainText').css('background', 'none');
  $('.trackName').html(nowPlayingObj.title);
  $('.artistAlbum').html(nowPlayingObj.channelTitle);
  $('.cover-art').attr('style', "background:url('" + nowPlayingObj.thumb + "');");
  $('.play').hide();
  $('.pause').show();
  // gtag('config', 'UA-118583968-1', {'page_path': "/?playlist='" + window.currentPlaylist['name'] + "'&title='"+nowPlayingObj.title + "'&id='" + nowPlayingObj.id + "'"});
  getTimes();
}

function updateOneTrackData() {
  if(window.selected == undefined) {
    var track = player.getVideoData();
    $('.mainText').css('background', 'none');
    $('.trackName').html(track['title']);
    $('.artistAlbum').html(track['author']);
    // gtag('config', 'UA-118583968-1', {'page_path': "/?title='" + track['title'] + "'&id='" + track['video_id'] + "'"});
    getTimes();
  }
}


var App = angular.module('RdioApp', ['ngDragDrop', 'appDirectives', 'appFilters']);

App.controller('TrackController', function($scope, $http){

  if(localStorage.getItem('recentlyPlayedList') != undefined){
    recentlyPlayedList = JSON.parse(localStorage.getItem('recentlyPlayedList'));
  }

  $scope.playlists = [
    recentlyPlayedList, 
    iTunesHTMLPlaylist, 
    wysPlaylist,
    // eraserheadPlaylist, 
    ninetiesHousePlaylist, 
    slowJamsPlaylist,
    freestylePlaylist,
    // filamOPMPlaylist,
    // adultContemporaryPlaylist,
    // shermervillePlaylist,
    // early80sPlaylist,
    // abbaGoldPlaylist,
    internationalPlaylist,
    wonderYearsPlaylist,
    // newEditionStoryPlaylist, 
    // cobrakaiPlaylist 
  ];

  $scope.manualPlaylistsCount = $scope.playlists.length;

  if(localStorage.getItem('userCreatedPlaylists') != undefined){
    $scope.userCreatedPlaylists = JSON.parse(localStorage.getItem('userCreatedPlaylists'));
  } else {
    $scope.userCreatedPlaylists = userCreatedPlaylists;
  }

  if($scope.userCreatedPlaylists.length > 0){
    for(i=0; i<$scope.userCreatedPlaylists.length; i++){
      $scope.playlists.push($scope.userCreatedPlaylists[i]);
    }
  }

  $scope.searchResults = iTunesHTMLPlaylist['tracks'];
  $scope.plData = getPLData($scope.searchResults);

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
        // console.log(response.result.items);
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
        // console.log(returnObj);
        $scope.$apply(function() {
          $scope.searchResults = [returnObj];
        });
      });

    });
  };

  $('#urlSearch input').val('http://djwysiwyg.com');
  $scope.kindaSurfTheWeb = function(){
    var url = $('#urlSearch input').val();
    if (url.slice(0, 7) != 'http://'){
      url = "http://" + url;
    }
    $('.not-safari iframe').attr('src', url);
  };

  $('#urlSearch input').on('focus', function(){
    $('#urlSearch input').val("");
  }); 

  $scope.hidePlaylistMenu = function(){
    $('.rc-menu-playlist').hide();
  };

  $scope.addPlaylist = function(playlistName){
    var newPlaylistObject = {name: playlistName, tracks: []};
    $('.rowToAddPlaylist').hide();
    $('.rowToAddPlaylist input').val('');
    $scope.playlists.push(newPlaylistObject);
    $scope.userCreatedPlaylists.push(newPlaylistObject);
    localStorage.setItem('userCreatedPlaylists', JSON.stringify($scope.userCreatedPlaylists));
  };

  $scope.setMaster = function(song){
    $scope.selected = song;
    $scope.activePL = $scope.selectedPL;
    $scope.selectedPL = "";
  };

  $scope.isSelected = function(song){
    return $scope.selected === song;
  };

  $scope.setRightSelected = function(song, index){
    $scope.rightSelected = song;
    $scope.targetIndex = index;
  };

  $scope.setRightSelectedPL = function(playlist, index){
    $scope.rightSelectedPL = playlist;
    $scope.targetIndexPL = index;
    // console.log($scope.targetIndexPL);
  };

  $scope.setMasterPL = function(playlist){
    $scope.selectedPL = playlist;
    $scope.selected = "";
    $scope.searchResults = playlist['tracks'];
    $scope.plData = getPLData(playlist['tracks']);
  };

  $scope.isSelectedPL = function(playlist){
    return $scope.selectedPL === playlist;
  };

  $scope.addToPlaylist = function(array, song){
    array.push(song);
    $('.rc-menu-search').hide();
    localStorage.setItem('userCreatedPlaylists', JSON.stringify($scope.userCreatedPlaylists));
  };

  $scope.removeFromPlaylist = function(index){
    $scope.activePL.tracks.splice(index, 1);
    $('.rc-menu-search').hide();
    localStorage.setItem('userCreatedPlaylists', JSON.stringify($scope.userCreatedPlaylists));
  };

  $scope.deletePlaylist = function(){
    var adjustedIndexPL = $scope.targetIndexPL - 8;
    $scope.userCreatedPlaylists.splice(adjustedIndexPL, 1);
    $scope.playlists[$scope.targetIndexPL].deleted = true;
    $('.rc-menu-playlist').hide();
    $scope.$apply();
    localStorage.setItem('userCreatedPlaylists', JSON.stringify($scope.userCreatedPlaylists));
  };

// for new playlist
// a = player.getPlaylist();
// a.push('dQw4w9WgXcQ');
// b = player.getPlaylistIndex();
// player.pauseVideo();
// c = player.getCurrentTime();
// player.loadPlaylist(a);
// player.playVideoAt(b);
// player.seekTo(c);

  $scope.onOver = function(e) {
    angular.element(e.target).toggleClass("dropPlaylist");
  };

  $scope.onOut = function(e) {
    angular.element(e.target).toggleClass("dropPlaylist");
  };

  $scope.onDrop = function(e) {
    angular.element(e.target).removeClass("dropPlaylist");
    localStorage.setItem('userCreatedPlaylists', JSON.stringify($scope.userCreatedPlaylists));
  };

  $scope.dblClicked = function(){
    $('.trackName').css('opacity', 0);
    window.currentPlaylist = player.getPlaylist();
    $('.mainText').css('background', 'none');
    $('.trackName').html($scope.selected.title);
    $('.artistAlbum').html($scope.selected.channelTitle);
    $('.cover-art').attr('style', "background:url('" + $scope.selected.thumb + "');");
    player.loadPlaylist([$scope.selected.id]);
    player.playVideo();
    recentlyPlayedList['tracks'].push($scope.selected);
    localStorage.setItem('recentlyPlayedList', JSON.stringify(recentlyPlayedList));
    $('.play').hide();
    $('.pause').show();
    $('.lbl-play').hide();
    $('.lbl-pause').show();
    // gtag('config', 'UA-118583968-1', {'page_path': "/?title='" + $scope.selected.title + "'&id='" + $scope.selected.id + "'"});
    getTimes();
    checkText();
  };

  $scope.dblClickedPL = function(playlist){
    $('.trackName').css('opacity', 0);
    window.currentPlaylist = playlist;
    var allTrackIDs = [];
    var tracks = playlist['tracks'];
    for(i=0;i<tracks.length;i++){
      allTrackIDs.push(tracks[i]['id']);
    }
    player.loadPlaylist(allTrackIDs);
    $('.play').hide();
    $('.pause').show();
    $('.lbl-play').hide();
    $('.lbl-pause').show();
    checkText();
    // gtag('config', 'UA-118583968-1', {'page_path': "/?playlist='" + playlist['name'] + "'"});
  };

  $scope.dateToday = $.datepicker.formatDate("DD, M d, yy", new Date());

});


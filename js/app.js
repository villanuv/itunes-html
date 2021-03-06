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
    updateTrackData();
    checkText();
  }
  if(event.data == 1 && isSkipping() == false && window.selected == undefined) {
    // console.log('one track update');
    updateOneTrackData();
    checkText();
  }
  if(event.data == 0) {
    $('.pause').hide();
    $('.play').show();
  }
  if(event.data == 3) {
    checkText();
    // $('.trackName').html("Buffering...");
    // $('.artistAlbum').html("Please wait");
    // $('.mainText').css('background', 'none');
  }
}

function updateTrackData() {
  var playlistData = window.currentPlayingPL['tracks'];
  var nowPlayingId = player.getVideoData().video_id;
  var allVideoIds = _.map(currentPlayingPL.tracks, function (song) { return song.id });
  var nowPlayingIndex = _.indexOf(allVideoIds, nowPlayingId);
  var adjustedIndex = nowPlayingIndex + 1;
  var nowPlayingObj = playlistData[nowPlayingIndex];
  recentlyPlayedList['tracks'].push(nowPlayingObj);
  localStorage.setItem('recentlyPlayedList', JSON.stringify(recentlyPlayedList));

  $('.mainText').css('background', 'none');
  $('.trackName').html(nowPlayingObj.title);
  $('.artistAlbum').html(nowPlayingObj.channelTitle);
  $('.cover-art').attr('style', "background:url('" + nowPlayingObj.thumb + "');");
  $('.play').hide();
  $('.pause').show();
  // gtag('event', 'track data updated');
  // gtag('config', 'UA-118583968-1', {'page_path': "/?playlist='" + window.currentPlayingPL['name'] + "'&title='"+nowPlayingObj.title + "'&id='" + nowPlayingObj.id + "'"});
  getTimes();

  if(viewingPL == currentPlayingPL){
    $('.DraggableThings tr td.index').removeClass('playing');
    $('.DraggableThings tr td.index').removeClass('playing-white');
    $('.DraggableThings tr td.index').removeClass('playing-ltgray');

    if(nowPlayingIndex == 0){
      $('.DraggableThings tr:nth-child(' + adjustedIndex + ') td.index').addClass('playing-white');
    }
    if(nowPlayingIndex == 1){
      $('.DraggableThings tr:nth-child(' + adjustedIndex + ') td.index').addClass('playing-ltgray');
    }
    if(nowPlayingIndex > 0 && nowPlayingIndex % 2 == 0){
      $('.DraggableThings tr:nth-child(' + adjustedIndex + ') td.index').addClass('playing-white');
    }
    if(nowPlayingIndex > 0 && nowPlayingIndex % 2 == 1){
      $('.DraggableThings tr:nth-child(' + adjustedIndex + ') td.index').addClass('playing-ltgray');
    }
  }
}

function updateOneTrackData() {
  if(window.selected == undefined) {
    var track = player.getVideoData();
    $('.mainText').css('background', 'none');
    $('.trackName').html(track['title']);
    $('.artistAlbum').html(track['author']);
    // gtag('event', 'single track data updated');
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
    // slowJamsPlaylist,
    // freestylePlaylist,
    // filamOPMPlaylist,
    // adultContemporaryPlaylist,
    // shermervillePlaylist,
    // early80sPlaylist,
    // abbaGoldPlaylist,
    // internationalPlaylist,
    // wonderYearsPlaylist,
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

  $scope.viewingPL = iTunesHTMLPlaylist;
  window.viewingPL = iTunesHTMLPlaylist;
  $scope.searchResults = iTunesHTMLPlaylist['tracks'];
  $scope.plData = getPLData($scope.searchResults);
  $scope.plDataSubdata = $scope.plData.replace(",", " •");

  $scope.submit = function(){
    $('.DraggableThings tr td.index').removeClass('playing');
    $('.DraggableThings tr td.index').removeClass('playing-white');
    $('.DraggableThings tr td.index').removeClass('playing-ltgray');

    gapi.client.setApiKey(apiKey);
    gapi.client.load('youtube', 'v3', function() {

      var q = $('#searchField').val();
      // gtag('config', 'UA-118583968-1', {'page_path': "/?q='"+q+"'"});
      // gtag('event', 'search');
      $scope.viewingPL = "";

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
        console.log(returnObj);
        $scope.$apply(function() {
          $scope.searchResults = [returnObj];
        });
        $('.playlist-header').hide();
      });

    });
  };

  $scope.notFinderSubmit = function(event){
    if(event.keyCode == 13){
      var notfinderq = $('.not-finder input').val();
      $('.not-finder').hide();
      $('.not-finder input').val('');
      $('.finder-video').center();
      $('.finder-video').show();
      // gtag('event', 'finder video seen');
      $('.finder-video iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
      // gtag('config', 'UA-118583968-1', {'page_path': "/?notfinderq='"+notfinderq+"'"});
    }
    if(event.keyCode == 27){
      $('.not-finder').hide();
      $('.not-finder input').val('');
    }
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

  // editViewingPLName
  $scope.addPlaylist = function(playlistName, event){
    // gtag('event', 'playlist created');
    if(event.keyCode == 13){
      var newPlaylistObject = {name: playlistName, tracks: []};
      $('.rowToAddPlaylist').hide();
      $('.rowToAddPlaylist input').val('');
      $scope.playlists.push(newPlaylistObject);
      $scope.userCreatedPlaylists.push(newPlaylistObject);
      localStorage.setItem('userCreatedPlaylists', JSON.stringify($scope.userCreatedPlaylists));
    }
    if(event.keyCode == 27){
      $('.rowToAddPlaylist').hide();
      $('.rowToAddPlaylist input').val('');
    }
  };

  $scope.setSelectedSong = function(song){
    $scope.selected = song;
    // $scope.viewingPLDim = true;
  };

  $scope.iconHackSwap = function(index){
    var selectedRow = index + 1;
    var nowPlayingId = player.getVideoData().video_id;
    var allVideoIds = _.map(viewingPL.tracks, function (song) { return song.id });
    var adjNowPlayingIndex = _.indexOf(allVideoIds, nowPlayingId) + 1;

    // when selectedRow specifially highlighted (regular play)
    if($('.DraggableThings tr:nth-child(' + selectedRow + ') td').hasClass('playing-white') == true){
      $('.DraggableThings tr td.playing-white').addClass('playing').removeClass('playing-white');
      return false;
    }

    if($('.DraggableThings tr:nth-child(' + selectedRow + ') td').hasClass('playing-ltgray') == true){
      $('.DraggableThings tr td.playing-ltgray').addClass('playing').removeClass('playing-ltgray');
      return false;
    }

    // when clicked off anywhere, should only be when it doesn't contain playing
    if($('.DraggableThings tr td').hasClass('playing') == true){
      if($('.DraggableThings tr:nth-child(' + selectedRow + ') td').hasClass('playing') == false){
        if(adjNowPlayingIndex % 2 == 0){
          $('.DraggableThings tr:nth-child(' + adjNowPlayingIndex + ') td.playing').addClass('playing-ltgray').removeClass('playing');
          return false;
        } else {
          $('.DraggableThings tr:nth-child(' + adjNowPlayingIndex + ') td.playing').addClass('playing-white').removeClass('playing');
          return false;
        }
        return false;
      }
      return false;
    }
  };

  $scope.iconHackSwapSingle = function(index){
    $('.DraggableThings tr td.index').removeClass('playing');
    $('.DraggableThings tr td.index').removeClass('playing-white');
    $('.DraggableThings tr td.index').removeClass('playing-ltgray');
    var adjustedIndex = index + 1;

    $('.DraggableThings tr:nth-child(' + adjustedIndex + ') td.index').addClass('playing');
  };

  $scope.isSelected = function(song){
    return $scope.selected === song;
  };

  $scope.isPlaying = function(song){
    if($scope.currentlyPlaying != undefined){
      return $scope.currentlyPlaying.id === song.id;
    }
  };

  $scope.isPlayingPL = function(){
    return $scope.selected.id === player.getVideoData().video_id;
  };

  $scope.checkIndex = function(song){
    return _.indexOf(window.currentlyPlaylist.tracks, song.id);
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

  $scope.setViewingPL = function(playlist){
    window.viewingPL = playlist;
    $scope.viewingPL = playlist;
    $scope.selected = "";
    // $scope.viewingPLDim = false;
    $scope.searchResults = playlist['tracks'];
    $scope.plData = getPLData(playlist['tracks']);
    $scope.plDataSubdata = $scope.plData.replace(",", " •");

    $('.playlist-header').show();
    $('.DraggableThings tr td.index').removeClass('playing');
    $('.DraggableThings tr td.index').removeClass('playing-white');
    $('.DraggableThings tr td.index').removeClass('playing-ltgray');
  };

  $scope.isViewingPL = function(playlist){
    return $scope.viewingPL === playlist;
  };

  $scope.setViewingPLDim = function(){
    if($('.currentPlaylist tr td').hasClass('activePL') == true){
      $('.currentPlaylist tr td.activePL').toggleClass('activePL');
      $('.currentPlaylist tr.selected').toggleClass('selected');
    }
  };

  $scope.addToPlaylist = function(array, song){
    // gtag('event', 'single added via contextmenu');
    array.push(song);
    $('.rc-menu-search').hide();
    localStorage.setItem('userCreatedPlaylists', JSON.stringify($scope.userCreatedPlaylists));
  };

  $scope.removeFromPlaylist = function(index){
    // window.viewingPL.tracks.splice(index, 1);
    // gtag('event', 'single removed via contextmenu');
    $scope.viewingPL.tracks.splice(index, 1);
    console.log($scope.viewingPL.tracks);
    $('.rc-menu-search').hide();
    localStorage.setItem('userCreatedPlaylists', JSON.stringify($scope.userCreatedPlaylists));
  };

  $scope.deletePlaylist = function(){
    // gtag('event', 'playlist deleted');
    var adjustedIndexPL = $scope.targetIndexPL - $scope.manualPlaylistsCount;
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
    // gtag('event', 'single added via drop');
    angular.element(e.target).removeClass("dropPlaylist");
    localStorage.setItem('userCreatedPlaylists', JSON.stringify($scope.userCreatedPlaylists));
  };

  $scope.dblClicked = function(song){
    $scope.currentlyPlaying = song;
    window.currentPlayingPL = player.getPlaylist(); // single track playlist
    $('.mainText').css('background', 'none');
    $('.trackName').html(song.title);
    $('.artistAlbum').html(song.channelTitle);
    $('.cover-art').attr('style', "background:url('" + song.thumb + "');");
    player.loadPlaylist([song.id]);
    player.playVideo();
    recentlyPlayedList['tracks'].push(song);
    localStorage.setItem('recentlyPlayedList', JSON.stringify(recentlyPlayedList));
    $('.play').hide();
    $('.pause').show();
    $('.lbl-play').hide();
    $('.lbl-pause').show();
    $('.DraggableThings tr td.index').removeClass('playing');
    $('.DraggableThings tr td.index').removeClass('playing-white');
    $('.DraggableThings tr td.index').removeClass('playing-ltgray');
    // gtag('event', 'single play');
    // gtag('config', 'UA-118583968-1', {'page_path': "/?title='" + song.title + "'&id='" + song.id + "'"});
    getTimes();
    checkText();
  };

  // $scope.checkForUpdates = function(){
  //   $scope.currentlyPlaying = window.currentPlayingPL[player.getPlaylistIndex()];
  // };

  $scope.dblClickedPL = function(playlist){
    window.viewingPL = playlist;
    window.currentPlayingPL = playlist;
    var allTrackIDs = [];
    var tracks = playlist.tracks;
    for(i=0;i<tracks.length;i++){
      allTrackIDs.push(tracks[i].id);
    }
    player.loadPlaylist(allTrackIDs);

    $('.play').hide();
    $('.pause').show();
    $('.lbl-play').hide();
    $('.lbl-pause').show();
    $('.DraggableThings tr td.index').removeClass('playing');
    $('.DraggableThings tr td.index').removeClass('playing-white');
    $('.DraggableThings tr td.index').removeClass('playing-ltgray');
    checkText();
    // gtag('event', 'playlist double clicked');
    // gtag('config', 'UA-118583968-1', {'page_path': "/?playlist='" + playlist['name'] + "'"});
  };

  $scope.dateToday = $.datepicker.formatDate("DD, M d, yy", new Date());

  // $scope.viewingPLName = $scope.viewingPL.name;

  $scope.editViewingPLName = function(event){
    if(event.keyCode == 13){
      // gtag('event', 'renamed from header');
      var newName = $('.editVLName').val();
      $scope.viewingPL.name = newName;
      localStorage.setItem('userCreatedPlaylists', JSON.stringify($scope.userCreatedPlaylists));
      $('.editVLName').val('');
      $('.editVLName').hide();
      $('.editable-name').show();
    }
    if(event.keyCode == 27){
      $('.editVLName').val('');
      $('.editVLName').hide();
      $('.editable-name').show();
    }
  };

  $scope.shufflePL = function(playlist){
    window.viewingPL = playlist;
    window.currentPlayingPL = playlist;
    var allTrackIDs = [];
    var tracks = playlist.tracks;
    for(i=0;i<tracks.length;i++){
      allTrackIDs.push(tracks[i].id);
    }
    var randomStart = Math.floor((Math.random() * allTrackIDs.length) + 1);
    player.loadPlaylist({playlist: allTrackIDs, index: randomStart});

    $('.play').hide();
    $('.pause').show();
    $('.lbl-play').hide();
    $('.lbl-pause').show();
    $('.DraggableThings tr td.index').removeClass('playing');
    $('.DraggableThings tr td.index').removeClass('playing-white');
    $('.DraggableThings tr td.index').removeClass('playing-ltgray');
    checkText();
    // gtag('event', 'shuffle from header');
    setTimeout(toggleShuffle, 2000);
  };

  $scope.songRating = function(song, index){
    var likes = parseInt(song.likeCount);
    var dislikes = parseInt(song.dislikeCount);
    var total = likes + dislikes;
    var stars = Math.round(5*likes/total);
    if(stars == 5){
      if($scope.selected == song){
        return 'stars5over';
      }     
      if(index % 2 == 0){
        return 'stars5odd';
      }
      if(index % 2 == 1){
        return 'stars5even';
      }
    }

    if(stars == 4){
      if($scope.selected == song){
        return 'stars4over';
      }   
      if(index % 2 == 0){
        return 'stars4odd';
      }
      if(index % 2 == 1){
        return 'stars4even';
      }
    }

    if(stars == 3){
      if($scope.selected == song){
        return 'stars3over';
      }   
      if(index % 2 == 0){
        return 'stars3odd';
      }
      if(index % 2 == 1){
        return 'stars3even';
      }
    }

    if(stars == 2){
      if($scope.selected == song){
        return 'stars2over';
      }   
      if(index % 2 == 0){
        return 'stars2odd';
      }
      if(index % 2 == 1){
        return 'stars2even';
      }
    }

    if(stars == 1){
      if($scope.selected == song){
        return 'stars1over';
      }   
      if(index % 2 == 0){
        return 'stars1odd';
      }
      if(index % 2 == 1){
        return 'stars1even';
      }
    }
  };

  // $scope.songRatingSwap = function(song, index){
  //   var likes = parseInt(song.likeCount);
  //   var dislikes = parseInt(song.dislikeCount);
  //   var total = likes + dislikes;
  //   var stars = Math.round(5*likes/total);
  //   var adjustedIndex = index + 1;
  //   if(stars == 5){
  //     $('.DraggableThings tr:nth-child(' + adjustedIndex + ') td.rating').addClass('stars5even');
  //   }

  //   if(stars == 4){

  //   }
  //   if(stars == 3){
  //     // return 'stars4odd';
  //   }
  //   if(stars == 2){
  //     // return 'stars4even';
  //   }
  //   if(stars == 1){
  //     // return 'stars3odd';
  //   }
  // };
});


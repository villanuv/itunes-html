// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '134',
    width: '220',
    playerVars: { 'controls': 0, 'fs': 0, 'showinfo': 0 },
    //videoId: 'M7lc1UVf-VE',
    events: {
      //'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
// var done = false;
function onPlayerStateChange(event) {
  // if (event.data == YT.PlayerState.PLAYING && !done) {
  //   setTimeout(stopVideo, 6000);
  //   done = true;
  // }
  if(event.data == 0) {
    togglePlay();
  }
}
function stopVideo() {
  player.stopVideo();
}

// 6. Custom functions

function playVideo(id) {
  player.loadVideoById(id);
  $('.pauseButton').toggle();
  $('.playButton').toggle();
}

function playResumeVideo() {
  player.playVideo();
  togglePlay();
}

function pauseVideo() {
  player.pauseVideo();
  togglePlay();
}

function togglePlay() {
  $('.pauseButton').toggle();
  $('.playButton').toggle();
}
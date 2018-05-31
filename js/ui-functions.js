// variables

var repeatImg1 = ['images/repeat-off.jpg', 'images/repeat-all.jpg'];
var repeatImg2 = ['images/repeat-off.jpg', 'images/repeat-one.jpg'];
var clickImg = 0;
var loop = false;
var shuffle = false;


// independent functions

function checkText() {
  if ($('.mainText')[0].scrollWidth >  $('.mainText').innerWidth()) {
    $('.trackName').addClass('animateTrackName');
  } else {
    $('.artistAlbum').css('margin', 0);
    $('.trackName').css('position','static');
    $('.trackName').removeClass('animateTrackName');
  }
  $('.trackName').css('opacity', 1);
}

function isSkipping() {
  if(player.getCurrentTime() > 5){
    return true;
  } else {
    return false;
  }
}

function launchNotMail() {
  $('.mail').show();
}

function launchNotiTunes() {
  $('.container').show();
  $('.menu-popup .show-not-itunes').hide();
  $('.menu-popup .hide-not-itunes').show();
}

function launchNotStickies() {
  $('.stickies').show();
}

function launchNotSafari() {
  $('.not-safari').show();
}

function getTimes() {
  var position = player.getCurrentTime();
  var duration = player.getDuration();
  $('.progress').css('width', Math.floor(100*position/duration)+'%');

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
  $('.time1').text(timeText1);
  $('.time2').text(timeText2);   
  setTimeout(getTimes, 500);
}

function setVolume(volume) {
  player.setVolume(volume);
};

function toggleRepeat(){
  if (clickImg == 1){
    clickImg = 0;
  } else {
    clickImg = 1;
  }
  if(player.getPlaylist().length == 1){
    img = repeatImg2[clickImg];
  } else {
    img = repeatImg1[clickImg];
  }
  $('.repeat-container img').attr("src", img);
  loop = !loop;
  player.setLoop(loop); 
}

function toggleShuffle(){
  if(typeof(currentPlaylist) == 'object' && player.getPlaylist().length > 1){
    $('.shuffle-container img').toggle();
    shuffle = !shuffle;
    player.setShuffle(shuffle);
  }
}

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
  $('.date').text(dateString);
  setTimeout(getDateString, 5000);
};
getDateString();

function ytDuration(string) {
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

function pluralCheck(word, num){
  if(num == 1){
    return ' ' + word.slice(0, -1);
  } else {
    return ' ' + word;
  }
}

function hourcheck(hours){
  if(hours != 0){
    return hours + pluralCheck("hours", hours) + ', ';
  } else {
    return ""
  }
}

function getPLData(array) {
  var songs = array.length;
  var times = _.map(array, function(song) { return ytDuration(song['duration']) });
  var hours = 0;
  var minutes = 0;
  var seconds = 0;

  for(i=0;i<times.length;i++){
    if(times[i].length > 5) {
      hours = hours + parseInt(times[i].slice(0, -6));
    }
    minutes = minutes + parseInt(times[i].slice(-5, -3));
    seconds = seconds + parseInt(times[i].slice(-2));
  }

  var moreMin = Math.floor(seconds/60);
  totalSec = seconds % 60;
  totalMin = minutes + moreMin;
  var hours = hours + Math.floor(totalMin/60);
  totalMin = totalMin % 60;
  return songs + pluralCheck("songs", songs) + ', ' + hourcheck(hours) + totalMin + pluralCheck("minutes", totalMin);
}

function requestFullScreen(element) {
  var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

  if (requestMethod) { // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

function validate() {
  var valid = true;
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  
  if(!regex.test($('.contactEmail').val())) {
    $('.contactEmail').css('border-color', 'red');
    valid = false;
  }
  if($.trim($('.contactName').val()) === "") {
    $('.contactName').css('border-color', 'red');
    valid = false;
  }
  if($.trim($('.contactMessage').val()) === "") {
    $('.contactMessage').css('border-color', 'red');
    valid = false;
  }
  
  return valid;
}


$(document).ready(function() {

  // event listeners to toggle right click menus

  document.addEventListener("click", function(e){
    if(!$(e.target).closest('.rc-menu-search').length) {
      if($('.rc-menu-search').is(":visible")) {
        $('.rc-menu-search').hide();
      }
    }   

    if(!$(e.target).closest('.rc-menu-playlist').length) {
      if($('.rc-menu-playlist').is(":visible")) {
        $('.rc-menu-playlist').hide();
      }
    } 
  });

  // custom right click things

  $('.searchPlaylist tr').bind("contextmenu", function(e) {
    $('.rc-menu-search').css("left", e.pageX);
    $('.rc-menu-search').css("top", e.pageY);
    $('.rc-menu-search').show();   
    e.preventDefault();
  });

  $('.currentPlaylist tr').bind("contextmenu", function(e) {
    $('.rc-menu-playlist').css("left", e.pageX);
    $('.rc-menu-playlist').css("top", e.pageY);
    $('.rc-menu-playlist').show();   
    e.preventDefault();
  });  

  // $(this).bind("contextmenu", function(e) {
  //   e.preventDefault();
  // });

});


// keyboard commands

$(document).keydown(function(e) {
  switch(event.altKey && e.which) {
    case 32:
      $('.pause').toggle();
      $('.play').toggle();
      if (player.getPlayerState() == 2 || player.getPlayerState() == 5) {
        player.playVideo();
        $('.lbl-play').toggle();
        $('.lbl-pause').toggle();
      }
      if (player.getPlayerState() == 1) {
        player.pauseVideo();
        $('.lbl-play').toggle();
        $('.lbl-pause').toggle();
      }
      break;
    case 37:
      player.seekTo(player.getCurrentTime()-3);
      break;
    case 39:
      player.seekTo(player.getCurrentTime()+3);
      break;
    case 38:
      player.setVolume(player.getVolume()+3);
      var newVolume = Math.floor(player.getVolume()/100*95);
      $('.slider').slider({value: newVolume});
      break;
    case 40:
      player.setVolume(player.getVolume()-3);
      var newVolume = Math.floor(player.getVolume()/100*95);
      $('.slider').slider({value: newVolume});
      break;
    case 219:
      if(window.currentPlaylist != undefined){
        player.previousVideo();
      }
      break;
    case 221:
      if(window.currentPlaylist != undefined){
        player.nextVideo();
      }
      break;
    case 78:
      $('.rowToAddPlaylist').show();
      $('.rowToAddPlaylist input').focus();
      break;
    case 82:
      toggleRepeat();
      break;
    case 83:
      toggleShuffle();
      break;
    case 68:
      localStorage.removeItem("recentlyPlayedList")
      break;
    default: 
      return;
  }
  e.preventDefault();
});


// interface

$('.progress').css('width', 0+'%');
$('.notification-ctr-block').css('height', $(window).height()-23);

$('.previous').click(function() { 
  var currentTime = player.getCurrentTime();
  var playlistCheck = player.getPlaylist();
  if(currentTime < 5 && playlistCheck != null){
    player.previousVideo();
  } else {
    player.seekTo(0);
  }
});

$('.play').click(function() { 
  player.playVideo();
  $('.play').hide();
  $('.pause').show();
  $('.lbl-play').toggle();
  $('.lbl-pause').toggle();
});

$('.pause').click(function() { 
  player.pauseVideo();
  $('.pause').hide();
  $('.play').show();
  $('.lbl-play').toggle();
  $('.lbl-pause').toggle();
});

$('.next').click(function() {
  var playlistCheck = player.getPlaylist();
  if(playlistCheck != null){
    player.nextVideo();
  } else {
    player.seekTo(player.getCurrentTime() + 3); 
  }
});

$('.container').draggable({
  handle: ".top-bar",
  delay: 300
});

$('.about-popup').draggable({
  handle: ".popup-top",
  delay: 300,
  containment: "window"
});

$('.mail').draggable({
  handle: ".mail-top",
  delay: 300,
  containment: "window"
});

$('.not-safari').draggable({
  handle: ".not-safari-top",
  delay: 300,
  iframeFix: true,
  containment: "window"
});

$('.stickies').draggable({
  handle: ".handle",
  delay: 300,
  containment: "window"
});

// $('.stickies .handle').dblclick(function(){
//   $(this).parent().find(".main").hide();
//   $(this).parent().closest(".stickies").toggleClass("stickies-shadow");
// });

$('.stickies img').click(function(){
  $(this).closest(".stickies").hide();
});

$('.slider').slider({
  min: 0,
  max: 95,
  value: 65,
  slide: function(event, ui) {
    setVolume(Math.floor(ui.value/95*100));
  }
});

$('.scrobble').slider({
  orientation: "horizontal",
  range: "min",
  max: 100,
  value: 20
});

$('.repeat-container img').click(function(){
  toggleRepeat();
});

$('.shuffle-container img').click(function(){
  toggleShuffle();
});

$('.app-name').click(function(){
  $('.app-name').toggleClass("app-name-over");
  $('.playlist-dropdown').removeClass("app-name-over");
  $('.controls-dropdown').removeClass("app-name-over");
  $('.date').removeClass("app-name-over");
  $('.playlist-popup').hide();
  $('.controls-popup').hide();
  $('.date-popup').hide();
  $('.menu-popup').toggle();
  $('.notification-ctr-block').show();
  if($('.notification-ctr-block').position().left != $(window).width()){
    $.when($('.notification-ctr-block').animate({"margin-right": '-=320'})) 
      .done(function(){
        $('.notification-ctr-block').hide();    
      });
  } else {
    $('.notification-ctr-block').hide();
  }
});

$('.playlist-dropdown').click(function(){
  $('.app-name').removeClass("app-name-over");
  $('.playlist-dropdown').toggleClass("app-name-over");
  $('.controls-dropdown').removeClass("app-name-over");
  $('.date').removeClass("app-name-over");
  $('.menu-popup').hide();
  $('.playlist-popup').toggle();
  $('.controls-popup').hide();
  $('.date-popup').hide();
  $('.notification-ctr-block').show();
  if($('.notification-ctr-block').position().left != $(window).width()){
    $.when($('.notification-ctr-block').animate({"margin-right": '-=320'})) 
      .done(function(){
        $('.notification-ctr-block').hide();    
      });
  } else {
    $('.notification-ctr-block').hide();
  }
});

$('.controls-dropdown').click(function(){
  $('.app-name').removeClass("app-name-over");
  $('.playlist-dropdown').removeClass("app-name-over");
  $('.controls-dropdown').toggleClass("app-name-over");
  $('.date').removeClass("app-name-over");
  $('.menu-popup').hide();
  $('.playlist-popup').hide();
  $('.controls-popup').toggle();
  $('.date-popup').hide();
  $('.notification-ctr-block').show();
  if($('.notification-ctr-block').position().left != $(window).width()){
    $.when($('.notification-ctr-block').animate({"margin-right": '-=320'})) 
      .done(function(){
        $('.notification-ctr-block').hide();    
      });
  } else {
    $('.notification-ctr-block').hide();
  }
});

$('.date').click(function(){
  $('.app-name').removeClass("app-name-over");
  $('.playlist-dropdown').removeClass("app-name-over");
  $('.controls-dropdown').removeClass("app-name-over");
  $('.date').toggleClass("app-name-over");
  $('.menu-popup').hide();
  $('.playlist-popup').hide();
  $('.controls-popup').hide();
  $('.date-popup').toggle();
  $('.notification-ctr-block').show();
  if($('.notification-ctr-block').position().left != $(window).width()){
    $.when($('.notification-ctr-block').animate({"margin-right": '-=320'})) 
      .done(function(){
        $('.notification-ctr-block').hide();    
      });
  } else {
    $('.notification-ctr-block').hide();
  }
});

$('.notification-ctr').click(function(){
  $('.notification-ctr-block').show();
  if($('.notification-ctr-block').position().left == $(window).width()){
    if($('.date-popup').css('display') == 'block'){
      $('.date').removeClass("app-name-over");
      $('.date-popup').hide();
    }
    if($('.notification-ctr-block').css('height') != $(window).height()-23){
      $('.notification-ctr-block').css('height', $(window).height()-23);
    }
    $('.notification-ctr-block').animate({"margin-right": '+=320'});
  } else {
    $.when($('.notification-ctr-block').animate({"margin-right": '-=320'})) 
      .done(function(){
        $('.notification-ctr-block').hide();    
      });
  }
  $('.app-name').removeClass("app-name-over");
  $('.playlist-dropdown').removeClass("app-name-over");
  $('.controls-dropdown').removeClass("app-name-over");
  $('.menu-popup').hide();
  $('.playlist-popup').hide();
  $('.controls-popup').hide();
});

$('.notification-ctr')
  .mousedown(function(){
    $('.notification-ctr').addClass("notification-ctr-over");
  })
  .mouseup(function(){
    $('.notification-ctr').removeClass("notification-ctr-over");
  });

$.fn.center = function() {
  this.css("position","absolute");
  this.css("top", ( jQuery(window).height() - this.height() ) / 2+jQuery(window).scrollTop() + "px");
  this.css("left", ( jQuery(window).width() - this.width() ) / 2+jQuery(window).scrollLeft() + "px");
  return this;
};

$('.menu-popup .about').click(function(){
  $('.app-name').toggleClass("app-name-over");
  $('.menu-popup').toggle();
  $('.about-popup').center();
  $('.about-popup').toggle();
});

$('.menu-popup .feedback').click(function(){
  $('.app-name').toggleClass("app-name-over");
  $('.menu-popup').toggle();
  $('.mail').show();
});

$('.menu-popup .hide-not-itunes').click(function(){
  $('.app-name').toggleClass("app-name-over");
  $('.menu-popup').toggle();
  $('.container').toggle();
  $('.menu-popup .show-not-itunes').toggle();
  $('.menu-popup .hide-not-itunes').toggle();
});

$('.menu-popup .show-not-itunes').click(function(){
  $('.app-name').toggleClass("app-name-over");
  $('.menu-popup').toggle();
  $('.container').toggle();
  $('.menu-popup .show-not-itunes').toggle();
  $('.menu-popup .hide-not-itunes').toggle();
});

$('.playlist-popup .new-playlist').click(function(){
  $('.playlist-dropdown').toggleClass("app-name-over");
  $('.playlist-popup').toggle();
  $('.rowToAddPlaylist').show();
  $('.rowToAddPlaylist input').focus();
});

$('.rc-menu-playlist .newPL').click(function(){
  $('.rowToAddPlaylist').show();
  $('.rowToAddPlaylist input').focus();
  $('.rc-menu-playlist').hide();
});

$('.playlist-popup .clear-recent').click(function(){
  $('.playlist-dropdown').toggleClass("app-name-over");
  $('.playlist-popup').toggle();
  localStorage.removeItem("recentlyPlayedList")
});

$('.controls-popup .play-pause').click(function(){
  $('.pause').toggle();
  $('.play').toggle();
  $('.lbl-play').toggle();
  $('.lbl-pause').toggle();
  if (player.getPlayerState() == 2 || player.getPlayerState() == 5) {
    player.playVideo();
  }
  if (player.getPlayerState() == 1) {
    player.pauseVideo();
  }
  $('.controls-dropdown').toggleClass("app-name-over");
  $('.controls-popup').toggle();
});

$('.controls-popup .next-video').click(function(){
  if(window.currentPlaylist != undefined){
    player.nextVideo();
  }
  $('.controls-dropdown').toggleClass("app-name-over");
  $('.controls-popup').toggle();
});

$('.controls-popup .previous-video').click(function(){
  if(window.currentPlaylist != undefined){
    player.previousVideo();
  }
  $('.controls-dropdown').toggleClass("app-name-over");
  $('.controls-popup').toggle();
});

$('.controls-popup .increase-vol').click(function(){
  player.setVolume(player.getVolume()+5);
  var newVolume = Math.floor(player.getVolume()/100*95);
  $('.slider').slider({value: newVolume});
  $('.controls-dropdown').toggleClass("app-name-over");
  $('.controls-popup').toggle();
});

$('.controls-popup .decrease-vol').click(function(){
  player.setVolume(player.getVolume()-5);
  var newVolume = Math.floor(player.getVolume()/100*95);
  $('.slider').slider({value: newVolume});
  $('.controls-dropdown').toggleClass("app-name-over");
  $('.controls-popup').toggle();
});

$('.controls-popup .repeat').click(function(){
  toggleRepeat();
  $('.controls-dropdown').toggleClass("app-name-over");
  $('.controls-popup').toggle();
});

$('.controls-popup .shuffle').click(function(){
  if(typeof(currentPlaylist) == 'object' && player.getPlaylist().length > 1){
    $('.shuffle-container img').toggle();
    shuffle = !shuffle;
    player.setShuffle(shuffle);
  }
  $('.controls-dropdown').toggleClass("app-name-over");
  $('.controls-popup').toggle();
});

$('.date-popup').click(function(){
  $('.date').toggleClass("app-name-over");
  $('.date-popup').toggle();
});

$('.rowToAddPlaylist input').blur(function(){
  $('.rowToAddPlaylist').hide();
  $('.rowToAddPlaylist input').val('');
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

var isChrome = !!window.chrome && !!window.chrome.webstore;
$('.dock-item2:nth-child(5)').click(function(){
  if($(window).width() > 1100 && $(window).height() > 600){
    $('.not-safari').center();
    $('.not-safari').show(); 
  }
});

$('.mail-top img.redBtn')
  .mouseover(function() { 
    $(this).attr("src", "images/btn-red-over.jpg");
  })
  .mouseout(function() {
    $(this).attr("src", "images/btn-red.jpg");
  });

$('.not-safari-top img.redBtn')
  .mouseover(function() { 
    $(this).attr("src", "images/btn-red-over.jpg");
  })
  .mouseout(function() {
    $(this).attr("src", "images/btn-red.jpg");
  });

$('.mail-top img.redBtn').click(function(){
  $('.mail').toggle();
});

$('.not-safari-top img.redBtn').click(function(){
  $('.not-safari').toggle();
  $('.not-safari iframe').attr('src', 'http://djwysiwyg.com');
});

$('.notiTunes-win-btns img:first-child')
  .mouseover(function() { 
    $(this).attr("src", "images/main-btn-red-over.jpg");
  })
  .mouseout(function() {
    $(this).attr("src", "images/main-btn-red.jpg");
  });

$('.notiTunes-win-btns img:first-child').click(function(){
  $('.container').toggle();
  $('.menu-popup .show-not-itunes').toggle();
  $('.menu-popup .hide-not-itunes').toggle();
});

$('.notiTunes-win-btns img:nth-child(3)')
  .mouseover(function() { 
    $(this).attr("src", "images/main-btn-green-over.jpg");
  })
  .mouseout(function() {
    $(this).attr("src", "images/main-btn-green.jpg");
  });

$('.notiTunes-win-btns img:nth-child(3)').click(function(){
  requestFullScreen(document.documentElement);
});

// form.on('input', '#email, #subject, #message', function() {
//   $(this).css('border-color', '');
//   info.html('').slideUp();
// });

$('.mailSend').on('click', function(e) {
  e.preventDefault();
  if(validate()) {
    $.ajax({
      type: "POST",
      url: "mailer.php",
      data: $('.contactForm').serialize(),
      dataType: "json"
    }).done(function(data) {
      if(data.success) {
        $('.contactName').val('');
        $('.contactEmail').val('');
        $('.contactMessage').val('');
        $('.mail').hide();
        // info.html('Message sent!').css('color', 'green').slideDown();
      } else {
        // info.html('Could not send mail! Sorry!').css('color', 'red').slideDown();
      }
    });
  }
});


// dock

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


// for scrobble

// $('.info').click(function(e){
//   console.log(e.pageX + ', ' + e.pageY);
// });


// toggle status bar

// $('.bottomBar').hide();
// $('.searchColumn').addClass('bottom-corner-right');
// $('#player').addClass('bottom-corner-left');
// $('.mainWindow').addClass('bottom-corner-left');

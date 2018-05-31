var appFilters = angular.module("appFilters", []);

appFilters.filter('convertYTDuration', function() {
  return function(string) {
    return ytDuration(string);
  }
});


appFilters.filter('convertYTDate', function() {
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
      var date = ytArr.join("/");
      var time = string.split("T")[1].split(":");
      var timestampHr = time[0];
      var timestampMin = time[1];
      if(parseInt(timestampHr) > 11){
        var ampm = "PM";
        timestampHr = String(parseInt(timestampHr) - 12);
      } else {
        var ampm = "AM";
      }
      if(timestampHr == "00" || timestampHr == "0"){
        timestampHr = "12";
      }
      if(timestampHr[0] == "0"){
        timestampHr = timestampHr[1];
      }
      return date + ', ' + timestampHr + ':' + timestampMin + ' ' + ampm;
    } else {
      return '';
    }
  }
});


appFilters.filter('truncatePlays', function() {
  return function(string) {
    if(string.length > 9) {
      playsAbbreviated = string[0]+'.'+string[1]+'bil';
      return playsAbbreviated;
    } else {
      return string;
    }
  }
});
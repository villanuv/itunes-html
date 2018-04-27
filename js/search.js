function keyWordsearch() {
  gapi.client.setApiKey('AIzaSyD89Rr5p7H20AI-YqPIDS5AxTEWNwWwDd4');
  gapi.client.load('youtube', 'v3', function() {
    makeRequest();
  });
}

function makeRequest() {
  var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: q,
    maxResults: 10,
    type: 'video',
    videoCategoryId: 10,
    part: 'snippet'                        
  });

  request.execute(function(response) {
    var str = JSON.stringify(response.result['items']);
    var data = JSON.parse(str);
    $('#search-results').html('');

    for(i=0; i<data.length; i++) {
      var vidId = data[i]['id']['videoId'];
      var vidTitle = data[i]['snippet']['title'];
      $('#search-results').append('<a href="#" onclick="playVideo(\'' + vidId + '\');">' + vidTitle + '</a><br>');
    }
  });
}
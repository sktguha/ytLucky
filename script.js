var GAPI;
window.gapi_onload = function(){
  gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
  GAPI = gapi;
}
var KEY = 'AIzaSyCR5In4DZaTP6IEZQ0r1JceuvluJRzQNLE';
inject_btn();
function inject_btn() {
    var btn = document.getElementById('search-btn');
    var luckyBtn = document.createElement('button');
    
    luckyBtn.className = btn.className;
    luckyBtn.dir = btn.dir;
    luckyBtn.id = "luckyBtn";
    luckyBtn.innerHTML = "I'm feeling lucky!";
    btn.parentNode.insertBefore(luckyBtn, btn);
    luckyBtn.onclick = start;
}

function start(){
	var elem = document.getElementById("masthead-search-term") || document.getElementsByName("search_query")[0]
	if(!elem){
		console.error('cannot find search input element');
		return;
	}
	var val = elem.val;
	search(val);
}

function onYouTubeApiLoad() {
    // This API key is intended for use only in this lesson.
    // See http://goo.gl/PdPA1 to get a key for your own applications.
    GAPI.client.setApiKey(KEY);

    //search();
}

function search(query) {
    // Use the JavaScript client library to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        q : query
    });
    request.execute(onSearchResponse);
}

function onSearchResponse(response) {
    var loc = response.items[0].id.videoId;
    window.location.href = 'http://www.youtube.com/watch?v='+loc;
}

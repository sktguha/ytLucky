    function onClientLoad() {
        gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
    }

    // Called automatically when YouTube API interface is loaded (see line 9).
    function onYouTubeApiLoad() {
        gapi.client.setApiKey('AIzaSyCR5In4DZaTP6IEZQ0r1JceuvluJRzQNLE');
    }

    function search(query, callback) {
        // Use the JavaScript client library to create a search.list() API call.
        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            q : query
        });

        // Send the request to the API server,
        // and invoke onSearchRepsonse() with the response.
        request.execute(callback);
    }
    chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
        search(request.input, function(response){
            var videoId = response.items[0].id.videoId;
            sendResponse({'videoId' : videoId});
        });
        // if sendResponse is called async then true needs to be returned, else sendResponse becomes invalid, http://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
        return true;
    });

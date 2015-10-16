    var KEY = "AIzaSyCbZXtN7-rCDxlVdmpsv7BBhjYKzGYfrkE";
    var getInterval = getIntervalFunction();
    attachScript();
    function attachScript(){
        var sc = document.getElementById('script');
        if(sc){
            sc.onerror = null;
            sc.parentElement.removeChild(sc);
        }
        sc = document.createElement("script");
        sc.src = "https://apis.google.com/js/client.js?onload=onClientLoad";
        sc.id = "script";
        document.body.appendChild(sc);
        sc.onerror = function(){
            setTimeout(attachScript, getInterval());
        }
    }

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

    function startsWith(str, ss){
        return str.substring(0, ss.length) === ss;
    }
    
    function getVideoId(items){
        for(var i = 0; i< items.length; i++){
            if(items[i].id && items[i].id.videoId){
                return items[i].id.videoId;
            }
        }
        return false;
    }

    function getIntervalFunction(retryLimit, minInterval, maxInterval) {
        var HIGH_INTERVAL = maxInterval || 300000,
            LOW_INTERVAL = (typeof minInterval == "undefined") ? 4000 : maxInterval,
            RETRY_LIMIT = retryLimit || 10,
            count = 0,
            interval = 0;
        return function () {
            if(count > RETRY_LIMIT){
                return -1;
            }
            interval = LOW_INTERVAL*Math.pow(2, count);
            count++;
            if(interval > HIGH_INTERVAL){
                return HIGH_INTERVAL;
            }
            return interval;
        }
    }
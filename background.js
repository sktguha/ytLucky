    var KEY = "AIzaSyDWvUACVgF-d7943gsCW9-OvPrjGS7pDq8";
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
    function onYouTubeApiLoad() {
        gapi.client.setApiKey(KEY);
    }

    function search(query, callback) {
        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            q : query
        });
        request.execute(callback);
    }
    chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
        var protocol = request.protocol;
        var input = request.input;
        search(input, function(response){
            if(response.items[0].id.videoId){
                url = (protocol || "https:") + "//www.youtube.com/watch?v="+response.items[0].id.videoId;   
            }
            else if(response.items[0].id.channelId){
                url = (protocol || "https:") + "//www.youtube.com/channel/" + response.items[0].id.channelId;
            } else {
                var videoId = getVideoId(response.items);
                if(!videoId){
                    console.error("no video id found in results");
                    return;
                }
                url = (protocol || "https:") + "//www.youtube.com/watch?v="+videoId;      
            }
            chrome.tabs.update(sender.tab.id, {"url": url});
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
            count = 0,
            interval = 0;
        return function () {
            if(retryLimit && count > retryLimit){
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

console.log('Odysee Playlist plugin loaded');

chrome.storage.sync.get(['currentPlayList'], function(result) {
    console.log('testing result', result);
    playListPlugin(result['currentPlayList']);
});

function playListPlugin(playList) {
    var currentURL = window.location.href;
    var currentVideoIndex = playList.findIndex((element) => element.url == currentURL);

    var updateData = {"currentVideoIndex": currentVideoIndex};

    if ( currentVideoIndex == -1 ) {
        var updateVideoIndex = {"currentVideoIndex": -1};
        chrome.storage.sync.set(updateVideoIndex);
        var updatePlayList = {"currentPlayList": []};
        chrome.storage.sync.set(updatePlayList);
        var udpatePlayListIndex = {"currentPlayListIndex": -1};
        chrome.storage.sync.set(udpatePlayListIndex);
        return;
    }

    chrome.storage.sync.set(updateData);

    document.getElementById("app").arrive("video#vjs_video_3_html5_api", function () {
        this.onended = function() {
            if ((currentVideoIndex+1) < playList.length) {
                window.location = playList[currentVideoIndex+1].url;
                return;
            }
            var updateVideoIndex = {"currentVideoIndex": -1};
            chrome.storage.sync.set(updateVideoIndex);
            var updatePlayList = {"currentPlayList": []};
            chrome.storage.sync.set(updatePlayList);
            var udpatePlayListIndex = {"currentPlayListIndex": -1};
            chrome.storage.sync.set(udpatePlayListIndex);
        }
    })
}
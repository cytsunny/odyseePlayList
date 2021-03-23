console.log('Odysee Playlist plugin loaded');

chrome.storage.sync.get(['currentPlaylist'], function(result) {
    console.log('testing result', result);
    playListPlugin(result['currentPlaylist']);
});

function playListPlugin(playList) {
    var currentURL = window.location.href;
    var currentVideoIndex = playList.findIndex((element) => element.url == currentURL);

    var updateData = {"currentVideoIndex": currentVideoIndex};

    if ( (currentVideoIndex == -1) ||
         ((currentVideoIndex+1) >= playList.length) ) {
        updateData = {"currentVideoIndex": -1};
        chrome.storage.sync.set(updateData);
        updateData = {"currentPlayList": []};
        chrome.storage.sync.set(updateData);
        udpateData = {"currentPlayListIndex": -1};
        chrome.storage.sync.set(updateData);
        return;
    }

    chrome.storage.sync.set(updateData);

    document.getElementById("app").arrive("video#vjs_video_3_html5_api", function () {
        this.onended = function() {
            window.location = playList[currentVideoIndex+1].url;
        }
    })
}
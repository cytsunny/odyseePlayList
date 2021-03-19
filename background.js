var storageData = {"currentPlaylist":[
    "https://odysee.com/@Fwfate:5/%E3%80%90%E4%B9%85%E9%81%A0%E3%81%9F%E3%81%BE%E3%80%91crow-song%EF%BC%88girls-dead:5",
    "https://odysee.com/@Fwfate:5/alchemy-girls-dead-monster-vtuber:2"
]};

console.log('testing', storageData);

chrome.storage.sync.set(storageData, function() {
    chrome.storage.sync.get(['currentPlaylist'], function(result) {
        playListPlugin(result['currentPlaylist']);
    });
});



function playListPlugin(playList) {
    var currentURL = window.location.href;
    var currentVideoIndex = playList.findIndex((element) => element == currentURL);

    if ( (currentVideoIndex == -1) ||
         ((currentVideoIndex+1) >= playList.length) )
        return;

    document.getElementById("app").arrive("video#vjs_video_3_html5_api", function () {
        this.onended = function() {
            console.log('testing addon ended')
            window.location = playList[currentVideoIndex+1];
        }
    })
}




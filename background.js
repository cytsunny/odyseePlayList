console.log('Odysee Playlist plugin loaded');

chrome.storage.sync.get(['currentPlaylist'], function(result) {
    console.log('testing result', result);
    playListPlugin(result['currentPlaylist']);
});

function playListPlugin(playList) {
    var currentURL = window.location.href;
    var currentVideoIndex = playList.findIndex((element) => element.url == currentURL);

    if ( (currentVideoIndex == -1) ||
         ((currentVideoIndex+1) >= playList.length) )
        return;

    document.getElementById("app").arrive("video#vjs_video_3_html5_api", function () {
        this.onended = function() {
            window.location = playList[currentVideoIndex+1].url;
        }
    })
}
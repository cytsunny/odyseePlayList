var storageData = {"currentPlaylist":[
    {"title":"crow song", "url":"https://odysee.com/@Fwfate:5/%E3%80%90%E4%B9%85%E9%81%A0%E3%81%9F%E3%81%BE%E3%80%91crow-song%EF%BC%88girls-dead:5"},
    {"title":"alchemy", "url":"https://odysee.com/@Fwfate:5/alchemy-girls-dead-monster-vtuber:2"}
]};
chrome.storage.sync.set(storageData, function() {
    chrome.storage.sync.get(['currentPlaylist'], function(result) {
        console.log("testing popup", result);
    });
})
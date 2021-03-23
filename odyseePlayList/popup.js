var storageData = {
    "playLists":[],
    "currentPlayListIndex": -1,
    "currentVideoIndex": -1,
    "currentPlaylist":[]
};

var currentDate = new Date();
console.log('testing', currentDate);

chrome.tabs.query({},function(tabs){
    var hasOdysee = false;
    tabs.forEach(function(tab){
        var tabURL = tab.url;
        if (tabURL && tabURL.startsWith('https://odysee.com/'))
            hasOdysee = true;
    });
    if (!hasOdysee) {
        var updateData = {"currentPlayListIndex": -1}
        chrome.storage.sync.set(updateData);
        updateData = {"currentVideoIndex": -1}
        chrome.storage.sync.set(updateData);
        updateData = {"currentPlaylist": []}
        chrome.storage.sync.set(updateData);
        storageData.currentPlayListindex = -1;
        storageData.currentVideoindex = -1;
        storageData.currentPlayList = [];
    }
});

chrome.storage.sync.get(['playLists', 'currentPlayList', 'currentPlayListIndex', 'currentVideoIndex'], function(result) {
    if (result.playLists)
        storageData.playLists = result.playLists;
    else {
        var initPlayLists = {playLists: storageData.playLists}
        chrome.storage.sync.set(initPlayLists)
    }
    if (result.currentPlayList)
        storageData.currentPlayList = result.currentPlayList;
    else {
        var initCurrentPlayList = {currentPlayList: storageData.currentPlayList}
        chrome.storage.sync.set(initCurrentPlayList);
    }
    if (result.currentPlayListIndex)
        storageData.currentPlayListIndex = result.currentPlayListIndex;
    else {
        var initCurrentPlayListIndex = {currentPlayListIndex: storageData.currentPlayListIndex}
        chrome.storage.sync.set(initCurrentPlayListIndex);
    }
    if (result.currentVideoIndex)
        storageData.currentVideoIndex = result.currentVideoIndex;
    else {
        var initCurrentVideoIndex = {currentVideoIndex: storageData.currentVideoIndex}
        chrome.storage.sync.set(initCurrentVideoIndex);
    }
    console.log("current storageData", storageData);
    chrome.tabs.getSelected(null,function(tab) {
        var currentURL = tab.url;
        var isOdysee = currentURL.startsWith('https://odysee.com/')
        addComponentsByData(isOdysee, currentURL);
    });
});

function addComponentsByData(isOdysee, currentURL) {
    var mainBody = "<h1>My Odysee Lists</h1>";

    for (var playListIndex in storageData['playLists']) {
        var isCurrentList = (playListIndex == storageData.currentPlayListIndex)
        var playListDiv = '<div id="list-'+playListIndex+'" class="play-list';
        if (isCurrentList)
            playListDiv += ' current-list';
        playListDiv += '">';

        playListDiv += '<div class="list-name-row">';
        playListDiv += '<div class="list-edit-buttons">';
        playListDiv += '<a title="Edit List Name" class="edit-list-button" id="edit-list-button-'+playListIndex+'"'+
                            ' data-list-id="'+playListIndex+'" data-video-id="'+videoIndex+'">&#128393;</a>';
        playListDiv += '<a title="Save List Name" class="save-list-button" id="save-list-button-'+playListIndex+'"'+
                        ' data-list-id="'+playListIndex+'" data-video-id="'+videoIndex+'">&#128190;</a>';
        playListDiv += '<a title="Delete Video" class="delete-list-button" id="delete-list-button-'+playListIndex+'"'+
                        ' data-list-id="'+playListIndex+'" data-video-id="'+videoIndex+'">&#128465;</a>';
        playListDiv += '</div>'
        playListDiv += '<input id="list-title-'+playListIndex+'" class="list-title" value="'+storageData['playLists'][playListIndex]['listName']+'" readonly/>';
        if (isCurrentList)
            playListDiv += '<span class="now-playing">Now Playing...</span>';
        else
            playListDiv += '<a class="play-list-button" data-list-id="'+playListIndex+'">&#9658; Play</a>'
        playListDiv += '</div>';

        for (var videoIndex in storageData['playLists'][playListIndex]["playList"]) {
            var videoData = storageData['playLists'][playListIndex]["playList"][videoIndex]
            playListDiv += '<div class="video-row'
            if (isCurrentList && (videoIndex == storageData.currentVideoIndex))
                playListDiv += ' current-video';
            playListDiv += '">';
            playListDiv += '<input class="video-number" id="video-number-'+playListIndex+'-'+videoIndex+'" value="' + (parseInt(videoIndex) + 1) + '" readonly/>';
            playListDiv += '<input class="video-title" id="video-title-'+playListIndex+'-'+videoIndex+'" value="' + videoData['title'] + '" readonly/>';
            playListDiv += '<input class="video-url" id="video-url-'+playListIndex+'-'+videoIndex+'" value="' + videoData['url'] + '" readonly/>';
            playListDiv += '<div class="video-edit-buttons">';
            playListDiv += '<a title="Edit Video" class="edit-button" id="edit-button-'+playListIndex+'-'+videoIndex+'"'+
                            ' data-list-id="'+playListIndex+'" data-video-id="'+videoIndex+'">&#128393;</a>';
            playListDiv += '<a title="Save Changes" class="save-button" id="save-button-'+playListIndex+'-'+videoIndex+'"'+
                            ' data-list-id="'+playListIndex+'" data-video-id="'+videoIndex+'">&#128190;</a>';
            playListDiv += '<a title="Delete Video" class="delete-button" id="delete-button-'+playListIndex+'-'+videoIndex+'"'+
                            ' data-list-id="'+playListIndex+'" data-video-id="'+videoIndex+'">&#128465;</a>';
            playListDiv += '</div>';
            playListDiv += '</div>';
        }
        playListDiv += '<div id="new-video-div-'+playListIndex+'" class="new-video-div video-row">';
        playListDiv += '<input class="video-number" id="new-video-number-'+playListIndex+'" value="' + (parseInt(videoIndex) + 2) + '" readonly/>';
        playListDiv += '<input class="video-title" id="new-video-title-'+playListIndex+'" value=""/>';
        playListDiv += '<input class="video-url" id="new-video-url-'+playListIndex+'" value=""/>';
        playListDiv += '<a title="Add New Video" id="save-new-button-'+playListIndex+'" class="save-new-button" data-list-id="'+playListIndex+'">&#128190;</a>';
        playListDiv += '</div>'
        if (isOdysee)
            playListDiv += '<a title="Add Current Odysee Video to List" class="add-current-button" data-list-id="'+playListIndex+'">+ Current</a>'
        playListDiv += '<a title="Add New Video to List" class="add-new-button" id="add-new-button-'+playListIndex+'"data-list-id="'+playListIndex+'">+ New</a>'
        playListDiv += '</div>';
        mainBody += playListDiv;
    }

    mainBody += '<div id="new-list-div" class="list-name-row">';
    mainBody += '<div class="list-edit-buttons">';
    mainBody += '<a title="Create new list with this name" class="save-new-list-button" id="save-new-list-button">&#128190;</a>';
    mainBody += '</div>';
    mainBody += '<input id="new-list-title" class="list-title" value="New Play List '+playListIndex+'"/>';
    mainBody += '</div>';
    mainBody += '<a title="Add New Play List" class="add-new-list-button" id="add-new-list-button">+ New List</a>';

    document.body.appendChild(document.createRange().createContextualFragment(mainBody));

    function startEditing() {
        var listIndex = this.getAttribute("data-list-id");
        var videoIndex = this.getAttribute("data-video-id");
        document.getElementById("video-title-"+listIndex+"-"+videoIndex).readOnly = false;
        document.getElementById("video-url-"+listIndex+"-"+videoIndex).readOnly = false;
        document.getElementById("edit-button-"+listIndex+"-"+videoIndex).style.display = 'none';
        document.getElementById("save-button-"+listIndex+"-"+videoIndex).style.display = 'inline-block';
    };

    var editButtons = document.getElementsByClassName("edit-button");
    for (var i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', startEditing, false);
    }

    function saveEditing() {
        var listIndex = this.getAttribute("data-list-id");
        var videoIndex = this.getAttribute("data-video-id");
        var videoTitleInput = document.getElementById("video-title-"+listIndex+"-"+videoIndex);
        videoTitleInput.readOnly = true;
        var videoURLInput = document.getElementById("video-url-"+listIndex+"-"+videoIndex);
        videoURLInput.readOnly = true;
        document.getElementById("edit-button-"+listIndex+"-"+videoIndex).style.display = 'inline-block';
        document.getElementById("save-button-"+listIndex+"-"+videoIndex).style.display = 'none';
        storageData.playLists[listIndex].playList[videoIndex].title = videoTitleInput.value;
        storageData.playLists[listIndex].playList[videoIndex].url = videoURLInput.value;
        var updateData = {"playLists": storageData.playLists};
        chrome.storage.sync.set(updateData);
    }

    var saveButtons = document.getElementsByClassName("save-button");
    for (var i = 0; i < saveButtons.length; i++) {
        saveButtons[i].addEventListener('click', saveEditing, false);
    }

    function deleteVideo() {
        var listIndex = this.getAttribute("data-list-id");
        var videoIndex = this.getAttribute("data-video-id");
        storageData.playLists[listIndex].playList.splice(videoIndex,1);

        if (listIndex == storageData.currentPlayListIndex) {
            var updateCurrentList = {"currentPlaylist": storageData.playLists[listIndex].playList}
            chrome.storage.sync.set(updateCurrentList);
        }
        var updateData = {"playLists": storageData.playLists};
        chrome.storage.sync.set(updateData, function() {
            location.reload();
        });
    }
    var deleteButtons = document.getElementsByClassName("delete-button");
    for (var i = 0; i < saveButtons.length; i++) {
        deleteButtons[i].addEventListener('click', deleteVideo, false);
    }


    function addCurrentVideo() {
        var listIndex = this.getAttribute("data-list-id");
        if (storageData.playLists[listIndex].playList.findIndex((element) => element.url == currentURL) != -1) {
            alert('Cannot add repeat video');
            return;
        }
        var newVideoIndex = storageData.playLists[listIndex].playList.length;
        storageData.playLists[listIndex].playList.push({"title":"video "+newVideoIndex, "url":currentURL})

        
        if (listIndex == storageData.currentPlayListIndex) {
            var updateCurrentList = {"currentPlaylist": storageData.playLists[listIndex].playList}
            chrome.storage.sync.set(updateCurrentList);
        }
        var updateData = {"playLists": storageData.playLists};
        chrome.storage.sync.set(updateData, function() {
            location.reload();
        });
    }

    var addCurrentButtons = document.getElementsByClassName("add-current-button");
    for (var i = 0; i < addCurrentButtons.length; i++) {
        addCurrentButtons[i].addEventListener('click', addCurrentVideo, false);
    }

    function startAddingNewVideo() {
        var listIndex = this.getAttribute("data-list-id");
        document.getElementById('new-video-div-'+listIndex).style.display = 'block';
        this.style.display = 'none';
    }

    var newVideoButtons = document.getElementsByClassName("add-new-button");
    for (var i = 0; i < newVideoButtons.length; i++) {
        newVideoButtons[i].addEventListener('click', startAddingNewVideo, false);
    }

    function saveNewVideo() {
        var listIndex = this.getAttribute("data-list-id");
        var videoTitleInput = document.getElementById("new-video-title-"+listIndex);
        var videoURLInput = document.getElementById("new-video-url-"+listIndex);
        var foundInList = storageData.playLists[listIndex].playList.findIndex((element) => element.url == videoURLInput.value)
        if (foundInList != -1) {
            alert('Cannot add repeat video');
            return;
        }

        storageData.playLists[listIndex].playList.push({
            "title": videoTitleInput.value,
            "url":videoURLInput.value
        })

        if (listIndex == storageData.currentPlayListIndex) {
            var updateCurrentList = {"currentPlaylist": storageData.playLists[listIndex].playList}
            chrome.storage.sync.set(updateCurrentList);
        }
        var updateData = {"playLists": storageData.playLists};
        chrome.storage.sync.set(updateData, function() {
            location.reload();
        });
    }

    var saveNewButtons = document.getElementsByClassName("save-new-button");
    for (var i = 0; i < saveNewButtons.length; i++) {
        saveNewButtons[i].addEventListener('click', saveNewVideo, false);
    }

    function playList() {
        var listIndex = this.getAttribute("data-list-id");
        if (isOdysee) {
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.update(tab.id, {url: storageData.playLists[listIndex].playList[0].url});
            });
        }
        else {
            chrome.tabs.create({url: storageData.playLists[listIndex].playList[0].url});
        }
        var updateData = {"currentPlayListIndex": listIndex}
        chrome.storage.sync.set(updateData);
        updateData = {"currentVideoIndex": 0}
        chrome.storage.sync.set(updateData);
        updateData = {"currentPlaylist": storageData.playLists[listIndex].playList};
        chrome.storage.sync.set(updateData);
        storageData.currentPlayListindex = listIndex;
        storageData.currentPlayList = storageData.playLists[listIndex].playList;
    }

    var playListButtons = document.getElementsByClassName("play-list-button");
    for (var i = 0; i < playListButtons.length; i++) {
        playListButtons[i].addEventListener('click', playList, false);
    }

    function startEditingListName() {
        var listIndex = this.getAttribute("data-list-id");
        document.getElementById("list-title-"+listIndex).readOnly = false;
        document.getElementById("edit-list-button-"+listIndex).style.display = 'none';
        document.getElementById("save-list-button-"+listIndex).style.display = 'inline-block';
    }

    var editListButtons = document.getElementsByClassName('edit-list-button');
    for (var i = 0; i < editListButtons.length; i++) {
        editListButtons[i].addEventListener('click', startEditingListName, false);
    }

    function saveListName() {
        var listIndex = this.getAttribute("data-list-id");
        var listNameInput = document.getElementById("list-title-"+listIndex)
        listNameInput.readOnly = true;
        document.getElementById("edit-list-button-"+listIndex).style.display = 'inline-block';
        document.getElementById("save-list-button-"+listIndex).style.display = 'none';
        storageData.playLists[listIndex].listName = listNameInput.value;
        var updateData = {'playLists':storageData.playLists};
        chrome.storage.sync.set(updateData);
    }

    var saveListButtons = document.getElementsByClassName('save-list-button');
    for (var i = 0; i < saveListButtons.length; i++) {
        saveListButtons[i].addEventListener('click', saveListName, false);
    }

    function deleteList() {
        var listIndex = this.getAttribute("data-list-id");
        var confirmDelete = confirm("Are you sure you want to delete "+storageData.playLists[listIndex].listName+"?");
        if (!confirmDelete)
            return;
        
        storageData.playLists.splice(listIndex, 1);
        var updateData = {'playLists':storageData.playLists};
        chrome.storage.sync.set(updateData, function() {
            location.reload();
        });
    }

    var deleteListButtons = document.getElementsByClassName('delete-list-button');
    for (var i = 0; i < deleteListButtons.length; i++) {
        deleteListButtons[i].addEventListener('click', deleteList, false);
    }

    function startAddingNewList() {
        document.getElementById('new-list-div').style.display = 'block';
        this.style.display = 'none';
    }

    document.getElementById('add-new-list-button').addEventListener('click', startAddingNewList, false);

    function addNewList() {
        storageData.playLists.push({
            "listName": document.getElementById('new-list-title').value,
            "playList": []
        });
        var updateData = {'playLists':storageData.playLists};
        chrome.storage.sync.set(updateData, function() {
            location.reload();
        });
    }

    document.getElementById('save-new-list-button').addEventListener('click', addNewList, false);
}


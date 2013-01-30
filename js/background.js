// Called when the url of a tab changes.
function checkForSongza(tabId, changeInfo, tab) {
    // If 'songza.com' is found in the tab's URL...
    if (tab.url.indexOf('songza.com') > -1) {
        // ... show the page action.
        chrome.pageAction.show(tabId);
    }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForSongza);

// Listen for the 'songChange' message from the content script
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == 'songChange' && request.song) {
        // store current song attributes in DOM of background page
        $('#artist').text(request.song.artist);
        $('#title').text(request.song.title);
    } else {
        sendResponse({});
    }
});

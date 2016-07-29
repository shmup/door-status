var CHECK_INTERVAL = 15000;
var CHECK_URL;

var timer = 0;
var last_status;

function updateIcon() {
    var request = new XMLHttpRequest();

    chrome.storage.sync.get(['requestUrl'], function(items) {
        CHECK_URL = items['requestUrl'];
    });

    alert(CHECK_URL);

    request.open("GET", CHECK_URL, true);
    request.onreadystatechange = function() {
        if (request.readyState != 4) return;
        var response = JSON.parse(request.responseText)
        var icon = response['doorStatus'] === 'closed' ? 'closed' : 'opened';

        if (last_status && icon != last_status) {
            timer = 0;
        }
        last_status = icon;
        chrome.browserAction.setIcon({path: icon + ".png"});
        chrome.browserAction.setTitle({title: icon + ' for at least ' + timer + ' seconds'});
    }
    request.send()
}

chrome.browserAction.onClicked.addListener(updateIcon);

updateIcon();

chrome.storage.onChanged.addListener(
  function(changes, namespace) {
    updateIcon();
  }
);

setInterval(function() {
    timer += CHECK_INTERVAL / 1000;
    updateIcon();
}, CHECK_INTERVAL)


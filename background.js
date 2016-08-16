var CHECK_INTERVAL = 15000;
var CHECK_URL;

var timer = 0;
var last_status;

function setIcon(status) {
    chrome.browserAction.setIcon({path: status + ".png"});
}

function setTitle(message) {
    chrome.browserAction.setTitle({title: message});
}

function setError(url) {
    setIcon('error');
    setTitle('There was an error polling: ' + url);
}

function pollServer() {
    chrome.storage.sync.get(['requestUrl'], function(items) {
        var url = items['requestUrl'];
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.timeout = 3000;
        request.onreadystatechange = function() {
            if (request.readyState !== 4) return;

            if (request.status === 200) {
                var response = JSON.parse(request.responseText)
                var status = response['doorStatus'] === 'closed' ? 'closed' : 'opened';

                if (last_status && status != last_status) {
                    timer = 0;
                }
                last_status = status;

                setIcon(status);
                setTitle(status + ' for at least ' + Math.floor(timer / 60) + ' min ' + (timer % 60) + ' sec');
            } else {
                timer = 0;
                setError(url);
            }
        }
        request.send()
    });
}

// force a repoll if an option changes
chrome.browserAction.onClicked.addListener(pollServer);
chrome.storage.onChanged.addListener(
    // function(changes, namespace) {
    function() {
        pollServer();
    }
);

// poll the server every X seconds
setInterval(function() {
    timer += CHECK_INTERVAL / 1000;
    pollServer();
}, CHECK_INTERVAL)

setIcon('init');

// init poll
pollServer();

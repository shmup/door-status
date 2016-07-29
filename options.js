// Saves options to chrome.storage
function save_options() {
  var url = document.getElementById('url').value;
  chrome.storage.sync.set({
    requestUrl: url
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
	// TODO - remove this default url so we can put on chrome store
    requestUrl: 'http://192.168.201.44'
  }, function(items) {
	debugger;
    document.getElementById('url').value = items.requestUrl;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

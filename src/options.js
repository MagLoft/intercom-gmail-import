function saveOptions() {
  var key = document.getElementById('key').value
  chrome.storage.sync.set({key: key}, function() {
    let status = document.getElementById('status')
    chrome.runtime.sendMessage("ckmapackjkkpnibiajegpmllhfoeombn", { action: "setIntercomAccessKey", message: key })
    status.textContent = 'Options saved.'
    setTimeout(function() { status.textContent = '' }, 750)
  })
}

function restoreOptions() {
  chrome.storage.sync.get({ key: '', domains: [] }, function(items) {
    document.getElementById('key').value = items.key
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)

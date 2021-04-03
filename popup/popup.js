window.onload = async function () {
    const enableButton = document.getElementById('enableCheckbox');
    chrome.storage.local.get(['enableExtension'], (result) => {
        enableButton.checked = result.enableExtension;

        enableButton.addEventListener('change', function () {

            if (this.checked) {
                chrome.storage.local.set({ 'enableExtension': true });
                sendChange('enabled');
            } else {
                chrome.storage.local.set({ 'enableExtension': false });
                sendChange('disabled');
            }
        });
    });
}

function sendChange(type) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        let activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": `extension-${type}` });
    });
}
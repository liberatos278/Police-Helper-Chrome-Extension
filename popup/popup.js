window.onload = async function () {
    const enableButton = document.getElementById('enableCheckbox');
    const variableAmountButton = document.getElementById('variableAmountCheckbox');

    chrome.storage.local.get(['enableExtension', 'variableAmount', 'moveAmount'], (result) => {
        variableAmountButton.checked = result.variableAmount ?? true;
        enableButton.checked = result.enableExtension ?? true;

        enableButton.addEventListener('change', function () {

            if (this.checked) {
                chrome.storage.local.set({ 'enableExtension': true });
                sendChange('enabled');
            } else {
                chrome.storage.local.set({ 'enableExtension': false });
                sendChange('disabled');
            }
        });

        variableAmountButton.addEventListener('change', function () {
            if (this.checked) {
                chrome.storage.local.set({ 'variableAmount': true });
                sendChange('variableAmount-enabled');
            } else {
                chrome.storage.local.set({ 'variableAmount': false });
                sendChange('variableAmount-disabled');
            }
        });
    });
}

function sendChange(type) {
    chrome.tabs.query({ url: '*://mdt.swrp.cz/*' }, function (tabs) {
        for(tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { "message": `extension-${type}` });
        }
    });
}
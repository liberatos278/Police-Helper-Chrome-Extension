window.onload = async function () {
    const enableButton = document.getElementById('enableCheckbox');
    const variableAmountButton = document.getElementById('variableAmountCheckbox');
    const moveAmountButton = document.getElementById('moveAmountCheckbox');

    chrome.storage.local.get(['enableExtension', 'variableAmount', 'moveAmount'], (result) => {
        variableAmountButton.checked = result.variableAmount ?? true;
        enableButton.checked = result.enableExtension ?? true;
        moveAmountButton.checked = result.moveAmount ?? false;

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

        moveAmountButton.addEventListener('change', function () {
            if(this.checked) {
                chrome.storage.local.set({ 'moveAmount': true });
                sendChange('moveAmount-enabled');
            } else {
                chrome.storage.local.set({ 'moveAmount': false });
                sendChange('moveAmount-disabled');
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
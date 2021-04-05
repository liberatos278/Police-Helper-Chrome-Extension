window.onload = async function () {
    const enableButton = document.getElementById('enableCheckbox');
    const variableAmountButton = document.getElementById('variableAmountCheckbox');
    const moveAmountButton = document.getElementById('moveAmountCheckbox');
    const jailAbleButton = document.getElementById('jailAbleCheckbox');
    const pointAbleButton = document.getElementById('pointAbleCheckbox');

    chrome.storage.local.get(['enableExtension', 'variableAmount', 'moveAmount', 'jailAble', 'pointAble'], (result) => {
        variableAmountButton.checked = result.variableAmount ?? true;
        enableButton.checked = result.enableExtension ?? true;
        moveAmountButton.checked = result.moveAmount ?? false;
        jailAbleButton.checked = result.jailAble ?? true;
        pointAbleButton.checked = result.pointAble ?? false;

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

        jailAbleButton.addEventListener('change', function () {
            if(this.checked) {
                chrome.storage.local.set({ 'jailAble': true });
                sendChange('jailAble-enabled');
            } else {
                chrome.storage.local.set({ 'jailAble': false });
                sendChange('jailAble-disabled');
            }
        });

        pointAbleButton.addEventListener('change', function () {
            if(this.checked) {
                chrome.storage.local.set({ 'pointAble': true });
                sendChange('pointAble-enabled');
            } else {
                chrome.storage.local.set({ 'pointAble': false });
                sendChange('pointAble-disabled');
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
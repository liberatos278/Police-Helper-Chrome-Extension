window.onload = async function () {

    //Checkbox elements
    const enableButton = document.getElementById('enableCheckbox');
    const variableAmountButton = document.getElementById('variableAmountCheckbox');
    const moveAmountButton = document.getElementById('moveAmountCheckbox');
    const jailAbleButton = document.getElementById('jailAbleCheckbox');
    const pointAbleButton = document.getElementById('pointAbleCheckbox');
    const autoInvoicingButton = document.getElementById('autoInvoicingCheckbox');
    const autoLoginButton = document.getElementById('autoLoginCheckbox');

    const form = document.getElementsByClassName('container')[0];
    const submitButton = document.getElementById('submit');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    //Getting data from chrome local storage
    chrome.storage.local.get([
        'enableExtension',
        'variableAmount',
        'moveAmount',
        'jailAble',
        'pointAble',
        'autoInvoicing',
        'autoLogin',
        'username',
        'password'
    ], (result) => {

        //Default settings
        variableAmountButton.checked = result.variableAmount ?? true;
        enableButton.checked = result.enableExtension ?? true;
        moveAmountButton.checked = result.moveAmount ?? false;
        jailAbleButton.checked = result.jailAble ?? true;
        pointAbleButton.checked = result.pointAble ?? false;
        autoInvoicingButton.checked = result.autoInvoicing ?? false;
        autoLoginButton.checked = result.autoLogin ?? false;

        autoLoginButton.checked === true ? form.style.display = 'inline' : form.style.display = 'none';
        if(result.username) usernameInput.value = result.username;
        if(result.password) passwordInput.value = result.password;

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
            if (this.checked) {
                chrome.storage.local.set({ 'moveAmount': true });
                sendChange('moveAmount-enabled');
            } else {
                chrome.storage.local.set({ 'moveAmount': false });
                sendChange('moveAmount-disabled');
            }
        });

        jailAbleButton.addEventListener('change', function () {
            if (this.checked) {
                chrome.storage.local.set({ 'jailAble': true });
                sendChange('jailAble-enabled');
            } else {
                chrome.storage.local.set({ 'jailAble': false });
                sendChange('jailAble-disabled');
            }
        });

        pointAbleButton.addEventListener('change', function () {
            if (this.checked) {
                chrome.storage.local.set({ 'pointAble': true });
                sendChange('pointAble-enabled');
            } else {
                chrome.storage.local.set({ 'pointAble': false });
                sendChange('pointAble-disabled');
            }
        });

        autoInvoicingButton.addEventListener('change', function () {
            if (this.checked) {
                chrome.storage.local.set({ 'autoInvoicing': true });
                sendChange('autoInvoicing-enabled');
            } else {
                chrome.storage.local.set({ 'autoInvoicing': false });
                sendChange('autoInvoicing-disabled');
            }
        });

        autoLoginButton.addEventListener('change', function () {
            if (this.checked) {
                chrome.storage.local.set({ 'autoLogin': true });
                form.style.display = 'inline';

                sendChange('autoLogin-enabled');
            } else {
                chrome.storage.local.set({ 'autoLogin': false });
                form.style.display = 'none';

                sendChange('autoLogin-disabled');
            }
        });
    });

    submitButton.addEventListener('click', function () {
        const username = document.getElementById('username');
        const password = document.getElementById('password');

        if (username.value === '' || !username.value) {
            return username.style.backgroundColor = '#e84d4d';
        } else username.style.backgroundColor = 'white';

        if (password.value === '' || !password.value) {
            return password.style.backgroundColor = '#e84d4d';
        } else password.style.backgroundColor = 'white';

        chrome.storage.local.set({ 'username': username.value });
        sendChange('user-username');

        chrome.storage.local.set({ 'password': password.value });
        sendChange('user-password');
    });

    usernameInput.addEventListener('input', function () {
        const username = document.getElementById('username');

        username.style.backgroundColor = 'white';
    });

    passwordInput.addEventListener('input', function () {
        const password = document.getElementById('password');

        password.style.backgroundColor = 'white';
    });
}

function sendChange(type) {
    chrome.tabs.query({ url: '*://mdt.swrp.cz/*' }, function (tabs) {
        for (tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { "message": `extension-${type}` });
        }
    });
}
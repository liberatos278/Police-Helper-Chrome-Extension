function checkChanges() {

    //Getting local storage data
    chrome.storage.local.get(['enableExtension', 'variableAmount', 'moveAmount', 'pointAble', 'jailAble', 'autoInvoicing', 'autoLogin', 'password', 'username'], function (result) {

        //Default settings if local storega data are undefined
        ifEnabled = result.enableExtension ?? true;
        variableAmountEnable = result.variableAmount ?? true;
        moveAmountEnable = result.moveAmount ?? false;
        jailAbleAlert = result.jailAble ?? true;
        pointAbleAlert = result.pointAble ?? false;
        autoInvoicing = result.autoInvoicing ?? false;
        autoLogin = result.autoLogin ?? false
        researchFine = result.researchFine ?? true;
        username = result.username ?? '';
        password = result.password ?? '';

        //Start checking if "reason" input exist
        checkInterval();

        //Trigger when new message request is created
        chrome.runtime.onMessage.addListener(

            function (request) {
                const input = document.getElementById('reason');
                const messageArr = request.message.split('-');

                const message = { type: messageArr[1], action: messageArr[2] };

                //Sorting by type of message
                switch (message.type) {
                    case 'enabled':

                        //Enabling extension
                        console.log("The extension has been turned on, I'm starting the control system");
                        ifEnabled = true;

                        checkInterval();
                        reSearch(input);
                        break;

                    case 'disabled':

                        //Disabling extension
                        console.log("The extension has been turned off, I'm shutting down all systems running in the background");
                        ifEnabled = false;

                        deepOff();
                        break;

                    case 'variableAmount':

                        if (message.action === 'enabled') variableAmountEnable = true; else variableAmountEnable = false;

                        disableAlerts();
                        reSearch(input);
                        break;

                    case 'moveAmount':

                        if (message.action === 'enabled') moveAmountEnable = true; else {
                            moveAmountEnable = false;
                            reSearch(input);
                        }
                        break;

                    case 'jailAble':

                        if (message.action === 'enabled') jailAbleAlert = true; else jailAbleAlert = false;

                        disableAlerts();
                        reSearch(input);
                        break;

                    case 'pointAble':

                        if (message.action === 'enabled') pointAbleAlert = true; else pointAbleAlert = false;

                        disableAlerts();
                        reSearch(input);
                        break;

                    case 'autoInvoicing':

                        if (message.action === 'enabled') autoInvoicing = true; else autoInvoicing = false;

                        autoInvoice();
                        reSearch(input);
                        break;

                    case 'autoLogin':

                        if (message.action === 'enabled') autoLogin = true; else autoLogin = false;
                        break;

                    case 'user':

                        if (message.action === 'password') password = result.password;
                        if (message.action === 'username') username = result.username;
                        break;

                    case 'researchFine':

                        if (message.action === 'enabled') researchFine = true; else researchFine = false;
                        break;
                }
            }
        )
    });
}

function reSearch(input) {
    if (input && input.value !== '') searchFine(input.value);
}
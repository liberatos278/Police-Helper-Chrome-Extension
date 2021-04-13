let errorLogin = false;

function autoLoginMDT() {

    //Checinkg if all needed data exist, if true start auto login
    if(!password || !username || password === '' || username === '' || errorLogin === true) return

    //Getting login form, if exist continue
    const existLogin = document.getElementById('username');
    
    if(existLogin) {

        //Getting all elements of login form
        const usernameInput = existLogin;
        const passwordInput = document.getElementById('passwd');
        const buttons = [...document.getElementsByTagName('button')];
        const submitButton = buttons.find(btn => btn.innerText === 'PŘIHLÁSIT SE');

        //Setting username & password (Saved in local browser storage)
        usernameInput.value = username;
        passwordInput.value = password;

        //Simulating input for Angular form
        passwordInput.dispatchEvent(new Event('input'));
        usernameInput.dispatchEvent(new Event('input'));

        //Submiting form -> login
        submitButton.click();

        setTimeout(function () {

            //Checking if any error occured
            const errorsContainer = document.getElementById('toast-container');
            const error = document.getElementsByClassName('toast-error')[0];

            if(!errorsContainer) return;

            const anyErrors = errorsContainer.contains(error);

            if(anyErrors === true) {

                //If error exist, repeat autologin once per 20000ms / 20s
                //Error login varibale stops autologin, when errored try exist
                errorLogin = true;

                setTimeout(function () {
                    errorLogin = false;
                }, 20000);
            }
        }, 500)
    }
}
let errorLogin = false;

function autoLoginMDT() {
    if(!password || !username || password === '' || username === '' || errorLogin === true) return

    const existLogin = document.getElementById('username');
    
    if(existLogin) {
        const usernameInput = existLogin;
        const passwordInput = document.getElementById('passwd');
        const buttons = [...document.getElementsByTagName('button')];
        const submitButton = buttons.find(btn => btn.innerText === 'PŘIHLÁSIT SE');

        usernameInput.value = username;
        passwordInput.value = password;

        passwordInput.dispatchEvent(new Event('input'));
        usernameInput.dispatchEvent(new Event('input'));

        submitButton.click();

        setTimeout(function () {
            const errorsContainer = document.getElementById('toast-container');
            const error = document.getElementsByClassName('toast-error')[0];

            if(!errorsContainer) return;

            const anyErrors = errorsContainer.contains(error);

            if(anyErrors === true) {
                errorLogin = true;

                setTimeout(function () {
                    errorLogin = false;
                }, 20000);
            }
        }, 500)
    }
}
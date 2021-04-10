function checkInterval() {

    //Checking if extension is enabled
    if (ifEnabled === false) return console.log('The extension is currently disabled, I am not continuing');

    const input = document.getElementById('reason');
    const value = document.getElementById('amount');
    const submitFine = [...document.getElementsByClassName('submitBtn')].find(btn => btn.innerText.includes('POTVRDIT'));

    console.log('Checking if there is an element with ID "reason"');

    if (input) {
        console.log(`Element exists! Now I'm creating an EventListener for the input, I'm also going to still check the validity of the element`);

        //AutoInvoice function
        autoInvoice();

        //Mobile points function
        mobilePoints();

        //Interval checking if fine form still exist
        const interval = setInterval(function () {

            if (!document.getElementById('reason')) {
                console.log('Element expired, running checkInterval() again');
                clearInterval(interval);
                checkInterval()
            }
        }, 1000);

        //Waiting for new input in "reason", if input is not empty start search function
        input.addEventListener('input', function () {
            if (ifEnabled === false) return
            const inputValue = this.value;

            if (inputValue.length < 1) {
                disableAlerts();
                restore();
                disableMobilePoints();
                return console.log('Input value is empty, waiting for more values');
            }

            const checkPoints = document.getElementById('pointsInput');
            checkPoints.dispatchEvent(new Event('input'));

            console.log('Input "reason" value changed, calling search function');
            searchFine(inputValue);
            if(researchFine === true) getCitizenID();
        });

        //Add right arrow bind to reason autofill
        input.addEventListener('keydown', function (e) {
            if (ifEnabled === false) return

            if (e.keyCode === 39 && validInput[0] === true) {

                const presumedInput = validInput[1];
                if (!presumedInput) return

                const reasonInput = document.getElementById('reason');
                if (!reasonInput) return

                //Setting reason and calling fake event to update Angular form
                reasonInput.value = `${presumedInput.name} (§${presumedInput.law} ${presumedInput.type} Code)`;
                reasonInput.dispatchEvent(new Event('input'));
            }
        });

        //Focus value input when wheel mooving
        value.addEventListener('wheel', function () {
            if (ifEnabled === false) return

            value.focus();
        });

        //Checking if user set more or lower in value input than limits 
        value.addEventListener('input', function () {
            if (ifEnabled === false) return

            let presumedInput = validInput;
            let minVal = 0, maxVal = 100000;

            if (presumedInput[1]) {
                maxVal = presumedInput[1].value;

                if (presumedInput[1].type !== 'Penal') {
                    minVal = maxVal;
                }
            }

            if (moveAmountEnable === true) {
                minVal = 0;
                maxVal = 100000;
            }

            //Reset data to maximal or minimal if user exceed
            value.value > maxVal ? value.value = maxVal : maxVal;
            value.value < minVal ? value.value = minVal : minVal;
        });

        submitFine.addEventListener('click', function () {
            addPoints();
        });

        //If element does not exist, start waiting for it
    } else {
        console.log('Element does not exist, I am creating an interval');

        const interval = setInterval(function () {
            const exist = document.getElementById('reason');

            if(autoLogin === true) autoLoginMDT();

            //Validate if form is fine form
            if (exist) {
                const validForm = exist.getAttribute('formcontrolname');

                //Starting init function againg
                if (validForm === 'fineReason') {

                    console.log('The element has appeared, I am deleting the interval and running the function again');
                    clearInterval(interval);
                    checkInterval();
                }
            }
        }, 1000);
    }
}
let unique, allData, ifEnabled, jailAlertInterval, validInput = [false];

window.onload = async function () {
    loadFines();
    checkChanges();
}

function loadFines() {
    const json = chrome.runtime.getURL("./fines.json");
    fetch(json)
        .then(response => response.json())
        .then(json => allData = json);
}

function checkChanges() {
    chrome.storage.local.get(['enableExtension'], function (result) {

        ifEnabled = result.enableExtension;
        checkInterval();

        chrome.runtime.onMessage.addListener(
            function (request) {
                if (request.message === 'extension-enabled') {
                    console.log("The extension has been turned on, I'm starting the control system");
                    ifEnabled = true;
                    checkInterval();
                } else {
                    console.log("The extension has been turned off, I'm shutting down all systems running in the background");
                    ifEnabled = false;
                    location.reload();
                }
            }
        )
    });
}

function checkInterval() {
    if (ifEnabled === false) return console.log('The extension is currently disabled, I am not continuing')

    // console.log(allData.json());
    const input = document.getElementById('reason');
    const value = document.getElementById('amount');

    console.log('Checking if there is an element with ID "reason"');

    if (input) {

        console.log(`Element exists! Now I'm creating an EventListener for the input, I'm also going to still check the validity of the element`);

        const interval = setInterval(function () {
            const input = document.getElementById('reason');

            if (!input) {
                console.log('Element expired, running checkInterval() again');
                clearInterval(interval);
                checkInterval()
            }
        }, 1000);

        input.addEventListener('input', function () {
            const inputValue = this.value;
            console.log('Input "reason" value changed, calling search function');

            if (inputValue.length < 1) {
                restore();
                return console.log('Input value is empty, waiting for more values');
            }
            searchFine(inputValue);
        });

        input.addEventListener('keydown', function (e) {
            if (e.keyCode === 39 && validInput[0] === true) {
                const presumedInput = validInput[1];
                if (!presumedInput) return

                const reasonInput = document.getElementById('reason');
                if (!reasonInput) return

                reasonInput.value = `${presumedInput.name} (${presumedInput.law} ${presumedInput.type} Code)`;
                reasonInput.dispatchEvent(new Event('input'));
            }
        });

        value.addEventListener('wheel', function () {
            value.focus();
        });

        value.addEventListener('input', function () {
            let presumedInput = validInput;
            let minVal = 0, maxVal = 100000000;

            if (presumedInput[1]) {
                maxVal = presumedInput[1].value;

                if (presumedInput[1].type !== 'Penal') {
                    minVal = maxVal;
                }
            }

            value.value > maxVal ? value.value = maxVal : maxVal;
            value.value < minVal ? value.value = minVal : minVal;
        });

    } else {
        console.log('Element does not exist, I am creating an interval')
        const interval = setInterval(function () {
            const actualInput = document.getElementById('reason');

            if (actualInput) {
                const validForm = actualInput.getAttribute('formcontrolname');

                if (validForm === 'fineReason') {
                    console.log('The element has appeared, I am deleting the interval and running the function again');
                    clearInterval(interval);
                    checkInterval();
                }
            }
        }, 1000);
    }
}

function searchFine(name) {
    name = name.toLowerCase();
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    console.log("I'm looking for the most likely answer...");

    const nameArray = name.split(/ +/);
    let resultArray = [];

    // Pokud je array slov větší než jedno slovo
    if (nameArray.length > 1) {
        nameArray.forEach(word => {
            const sessionData = allData.filter(obj => obj.tags.includes(word));

            resultArray = resultArray.concat(sessionData);
        });

        // Pokud je v array jen jedno slovo
    } else {
        const onlyWord = nameArray[0];

        for (fine of allData) {
            fine.tags.forEach(tag => {
                if (tag.includes(onlyWord)) {
                    resultArray.push(fine);
                }
            })
        }
    }

    unique = [...new Set(resultArray)];

    unique = unique.sort((a, b) => {
        const aIndex = resultArray.filter(obj => obj.law === a.law).length;
        const bIndex = resultArray.filter(obj => obj.law === b.law).length;

        if (aIndex > bIndex) return -1;
        if (aIndex < bIndex) return 1;
        return 0;
    });

    console.log("I'm checking the search results");

    editHTML(unique);
}

function editHTML(params) {
    let searchResultTarget = document.getElementById('search_result');

    if (!searchResultTarget) {
        const searchResult = document.createElement('label');
        const formDiv = [...document.getElementsByClassName('ng-invalid')];
        const inputElement = document.getElementById('amountDiv');
        const insertDiv = formDiv.find(element => element.nodeName === 'FORM');

        console.log("I'm creating a new field to display search results");

        searchResultTarget = insertDiv.insertBefore(searchResult, inputElement);
    } else {
        searchResultTarget.style.display = 'inline';
        console.log("The display field already exists, I'm making it visible")
    }

    if (params[0]) {
        searchResultTarget.innerHTML = `Fine: ${params[0].name} - ${params[0].law} ${params[0].type} Code`;
        validInput = [true, params[0]];
        console.log("I'm creating a result string");
    } else {
        searchResultTarget.innerHTML = `System did not find a match`;
        validInput = [false];
        console.log("No results found during the search");
    }

    searchResultTarget.style.fontSize = '10px';
    searchResultTarget.id = 'search_result';

    console.log("Setting result...");

    setNewData(params[0]);
}

function setNewData(data) {
    const valueInput = document.getElementById('amount');
    const spans = [...document.getElementsByTagName('span')];
    const usdSpan = spans.find(span => span.innerHTML === 'USD');
    const variableLabel = document.getElementById('variable_amount');

    let colorToSet = 'white';

    if (valueInput && data) {
        valueInput.value = data.value;

        valueInput.dispatchEvent(new Event('input'));

        if (data.type === 'Penal') {
            colorToSet = '#22a12a';
            console.log("I allow the user to adjust the final amount");

            if (!variableLabel) {
                const newVariableLabel = document.createElement('label');
                const amountDiv = document.getElementById('amountDiv');
                const beforeElement = usdSpan;

                newVariableLabel.innerHTML = 'Variable amount';
                newVariableLabel.style.fontSize = '10px';
                newVariableLabel.style.color = '#22a12a';
                newVariableLabel.id = 'variable_amount';

                amountDiv.insertBefore(newVariableLabel, beforeElement);
            } else {
                variableLabel.style.display = 'inline';
                variableLabel.innerHTML = 'Variable amount';
                variableLabel.style.color = '#22a12a';
            }
        } else if (variableLabel) {
            variableLabel.style.display = 'none';
        }

        //if (data.jailable === true) jailAlert();

    } else if (valueInput && !data) {
        valueInput.value = '';
        valueInput.dispatchEvent(new Event('input'));
        if (variableLabel) variableLabel.style.display = 'none';
        console.log("I am sending simulated data, for permission from the web to send the results");
    }

    usdSpan.style.color = colorToSet;
}

function restore() {
    unique = [];
    const searchLabel = document.getElementById('search_result');
    const valueInput = document.getElementById('amount');
    const variableLabel = document.getElementById('variable_amount');

    const spans = [...document.getElementsByTagName('span')];
    const usdSpan = spans.find(span => span.innerHTML === 'USD');

    if (valueInput) valueInput.value = '';
    if (searchLabel) searchLabel.style.display = 'none';
    if (usdSpan) usdSpan.style.color = 'white';
    if (variableLabel) variableLabel.style.display = 'none';

    // valueInput.dispatchEvent(new Event('input'));

    validInput = [false];

    console.log('The system has been reset successfully, waiting to be turned on again');
}

function jailAlert() {
    const variableLabel = document.getElementById('variable_amount');

    if (variableLabel && variableLabel.style.display !== 'none') {
        let actualStatus = false;

        jailAlertInterval = setInterval(function () {
            if (actualStatus === false) {
                variableLabel.innerHTML = 'Variable amount';
                variableLabel.style.color = '#22a12a';

                actualStatus = true;
            } else {
                variableLabel.innerHTML = 'Prison possible';
                variableLabel.style.color = '#cf5b08';

                actualStatus = false;
            }
        }, 3800);

    } else if (variableLabel) {
        variableLabel.innerHTML = 'Prison possible';
        variableLabel.style.color = '#cf5b08';
        variableLabel.style.display = 'inline';
    } else {
        const spans = [...document.getElementsByTagName('span')];
        const usdSpan = spans.find(span => span.innerHTML === 'USD');

        const newVariableLabel = document.createElement('label');
        const amountDiv = document.getElementById('amountDiv');
        const beforeElement = usdSpan;

        newVariableLabel.innerHTML = 'Prison possible';
        newVariableLabel.style.fontSize = '10px';
        newVariableLabel.style.color = '#cf5b08';
        newVariableLabel.id = 'variable_amount';

        amountDiv.insertBefore(newVariableLabel, beforeElement);
    }
}
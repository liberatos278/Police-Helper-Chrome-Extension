let unique, allData, ifEnabled, variableAmountEnable, moveAmountEnable, jailAbleAlert, pointAbleAlert, alertInterval, validInput = [false];

window.onload = async function () {
    loadFines();
    checkChanges();
}

function loadFines() {
    const json = chrome.runtime.getURL("../data/fines.json");
    fetch(json)
        .then(response => response.json())
        .then(json => { allData = json });
}

function restore() {
    unique = [];
    const searchLabel = document.getElementById('search_result');
    const valueInput = document.getElementById('amount');
    const variableLabel = document.getElementById('variable_amount');

    const spans = [...document.getElementsByTagName('span')];
    const usdSpan = spans.find(span => span.innerHTML === 'USD');

    if (valueInput) {
        valueInput.value = '';
    }

    if (searchLabel) searchLabel.style.display = 'none';
    if (usdSpan) usdSpan.style.color = 'white';
    if (variableLabel) variableLabel.style.display = 'none';

    validInput = [false];
    valueInput.dispatchEvent(new Event('input'));

    console.log('The system has been reset successfully, waiting to be turned on again');
}

function deepOff() {
    const timeoutID = setTimeout(";");
    for (let i = 0; i < timeoutID; i++) {
        clearTimeout(i);
    }

    const input = document.getElementById('reason');
    const value = document.getElementById('amount');

    if (input) {
        input.value = '';
        $(input).off();
        input.dispatchEvent(new Event('input'));
    }

    if (value) {
        value.value = '';
        $(value).off();
        value.dispatchEvent(new Event('input'));
    }

    restore();
    checkInterval();
}

function disableAlerts() {
    const label = document.getElementById('variable_amount');

    if(alertInterval) clearInterval(alertInterval);
    if(label) label.style.display = 'none';
}
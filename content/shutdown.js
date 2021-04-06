//Reseting data in all extension
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

    validInput = [false];

    //Calling fake input event to update Angular
    valueInput.dispatchEvent(new Event('input'));

    console.log('The system has been reset successfully, waiting to be turned on again');
}

//Disabling extension, deleting intervals and event listeners
function deepOff() {
    const timeoutID = setInterval(".");
    const input = document.getElementById('reason');

    for (let i = 0; i < timeoutID; i++) {
        clearInterval(i);
    }

    if (input) { input.value = ''; $(input).off(); }

    //Calling another function and fake event
    input.dispatchEvent(new Event('input'));
    restore();
    checkInterval();
}

//Function for clearing alerts
function disableAlerts() {
    const label = document.getElementById('variable_amount');

    if(alertInterval) clearInterval(alertInterval);
    if(label) label.style.display = 'none';
}
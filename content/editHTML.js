function editHTML(params) {

    //Reseting alerts for new result
    disableAlerts();

    let searchResultTarget = document.getElementById('search_result');

    //Checking for search label under reason input. If it is not exist creating new one
    if (!searchResultTarget) {
        const searchResult = document.createElement('label');
        const formDiv = [...document.getElementsByClassName('ng-invalid')];
        const inputElement = document.getElementById('amountDiv');
        const insertDiv = formDiv.find(element => element.nodeName === 'FORM' && !element.classList.contains('ng-pristine'));

        console.log("I'm creating a new field to display search results");

        searchResultTarget = insertDiv.insertBefore(searchResult, inputElement);
    } else {
        searchResultTarget.style.display = 'inline';
        console.log("The display field already exists, I'm making it visible")
    }

    //Setting search result to search label
    if (params[0]) {
        searchResultTarget.innerHTML = `Fine: ${params[0].name} - §${params[0].law} ${params[0].type} Code`;
        validInput = [true, params[0]];
        console.log("I'm creating a result string");
    } else {
        searchResultTarget.innerHTML = `System did not find a match`;
        validInput = [false];
        console.log("No results found during the search");
    }

    //Adding styles to text in inner
    searchResultTarget.style.fontSize = '10px';
    searchResultTarget.id = 'search_result';

    console.log("Setting result...");

    setNewData(params[0]);
}

function setNewData(data) {
    const valueInput = document.getElementById('amount');
    const variableLabel = document.getElementById('variable_amount');

    //Creating users settings for alerts (labels)
    if (valueInput && data) {
        let definitiveSettings = [];

        if (variableAmountEnable === true && data.type === 'Penal') definitiveSettings.push(true); else definitiveSettings.push(false);
        if (jailAbleAlert === true && data.jailable === true) definitiveSettings.push(true); else definitiveSettings.push(false);
        if (pointAbleAlert === true && data.pointable === true) definitiveSettings.push(true); else definitiveSettings.push(false);
        alerts(data, definitiveSettings);

        valueInput.value = data.value;

        //Simulating input event for Angular
        valueInput.dispatchEvent(new Event('input'));

    } else if (valueInput && !data) {

        //Clearing find result label, because reason input is empty
        valueInput.value = '';
        valueInput.dispatchEvent(new Event('input'));
        if (variableLabel) variableLabel.style.display = 'none';
        
        console.log("I am sending simulated data, for permission from the web to send the results");
    }
}

//Alerts under value input (Possible imprisonment, variable amount, pointable driver)
function alerts(data, set) {
    const settings = set;
    const trueIndex = getIndexOfAll(settings, true);
    let label = document.getElementById('variable_amount');

    //Finding before element for append
    const spans = [...document.getElementsByTagName('span')];
    const beforeElement = spans.find(span => span.innerHTML === 'USD');

    //Creating new alertLabel for alerts - if not exist
    if (!label) {
        const newVariableLabel = document.createElement('label');
        const amountDiv = document.getElementById('amountDiv');

        //Creating style
        newVariableLabel.style.display = 'none';
        newVariableLabel.style.fontSize = '10px';
        newVariableLabel.style.color = '#22a12a';
        newVariableLabel.id = 'variable_amount';

        //adding to parental Div
        amountDiv.insertBefore(newVariableLabel, beforeElement);
        label = newVariableLabel;
    }

    let numberNow = 0;
    if (!trueIndex || trueIndex === [] || !settings.includes(true)) return

    let firstShow = trueIndex[0];
    const maxPoints = data.maxPoints;

    label.style.display = 'inline';
    changeAlerts(firstShow, label, maxPoints);

    //Adding interval for changing alert title
    alertInterval = window.setInterval(function () {
        changeAlerts(trueIndex[numberNow], label, maxPoints);

        numberNow++;
        if (numberNow > trueIndex.length - 1) numberNow = 0;
    }, 2500);
}

//Main alert changer
function changeAlerts(index, label, maxPoints) {
    if (index === 0) {
        label.innerHTML = 'Variable amount';
        label.style.color = '#1f9c2e';

    } else if (index === 1) {
        label.innerHTML = 'Possible prison';
        label.style.color = '#ad1111';

    } else if (index === 2) {
        label.innerHTML = `Remove points (${maxPoints})`;
        label.style.color = '#d1bc1b';
    }
}

//Getting idexes of all elements in array with specific value
function getIndexOfAll(array, value) {
    let indexes = [], i = -1;

    while ((i = array.indexOf(value, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}

function autoInvoice() {
    const invoiceButton = document.querySelectorAll('[formcontrolname="sendBillCheck"]')[0];
    if(!invoiceButton) return;

    invoiceButton.checked = autoInvoicing;
}
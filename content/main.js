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
let searchedCitizenID;

function getCitizenID() {
    searchedCitizenID = Number(document.getElementsByClassName('resultQuery')[0].innerHTML.split(' | ')[1]);
}

function searchCitizen(id) {
    console.log(true)
    setTimeout(function () {
        const searchInput = document.getElementById('name');
        const submitBtn = [...document.getElementsByTagName('button')].find(btn => btn.innerText === 'VYHLEDAT');

        if (!searchInput || !submitBtn || !searchedCitizenID) return;

        searchInput.value = id;
        searchInput.dispatchEvent(new Event('input'));

        submitBtn.click();

        setTimeout(function () {
            const firstResult = document.getElementsByClassName('incident')[0];
            if (!firstResult) return

            firstResult.click();
        }, 300);
    }, 500);
}
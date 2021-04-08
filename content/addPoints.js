function addPoints() {
    const input = document.getElementById('pointsInput');
    const pointsToRemove = Number(input.value);

    if (!input.value || input.value === '0' || input.value === '') {
        if(researchFine === true) { searchCitizen(searchedCitizenID); }
        return;
    }

    //DMV site
    const veh = document.querySelectorAll('[routerlink="/search_vehicles"]')[0];
    veh.click();

    setTimeout(function () {
        
        const citizenID = document.querySelectorAll('[placeholder="Zadejte jméno / Citizen ID..."]')[0];
        const submitBtn = document.getElementsByTagName('button')[1];

        citizenID.value = searchedCitizenID;
        citizenID.dispatchEvent(new Event('input'));
        submitBtn.click();

        setTimeout(function () {
            const firstID = document.getElementsByClassName('incident')[0];
            firstID.click();

            setTimeout(function () {
                const actualPoints = Number(document.getElementsByClassName('licensePoints')[1].innerHTML.replace(' / 12', ''));
                const editPointsBtn = [...document.getElementsByClassName('btn')].find(btn => btn.innerHTML.includes('SPRAVOVAT BODY'));

                editPointsBtn.click();

                setTimeout(function () {
                    let ptnMinus = [...document.getElementsByClassName('pointsBtn')][1];

                    for(let i = 0; i < pointsToRemove+(12-actualPoints); i++) {
                        ptnMinus.click();
                    }

                    let submit = [...document.getElementsByClassName('btn')];
                    submit = submit.find(btn => btn.innerHTML.includes('POTVRDIT'));

                    submit.click();

                    setTimeout(function () {
                        const crim = document.querySelectorAll('[routerlink="/search_criminals"]')[0];
                        crim.click();

                        setTimeout(function () {
                            searchCitizen(searchedCitizenID);
                        }, 350);
                    }, 350);
                }, 350);
            }, 350);
        }, 350);
    }, 350);
}
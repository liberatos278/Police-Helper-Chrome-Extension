function addPoints() {
    const input = document.getElementById('pointsInput');
    const pointsToRemove = Number(input.value);
    let forceReturn = 0;

    if (!input.value || input.value === '0' || input.value === '') {
        if (researchFine === true) { searchCitizen(searchedCitizenID); }
        return;
    }

    setTimeout(function startSearch() {

        //DMV site
        const veh = document.querySelectorAll('[routerlink="/search_vehicles"]')[0];
        const reasonInput = document.getElementById('reason');

        if (!reasonInput) {
            forceReturn++;
            if (forceReturn > 3) return notify('Police Helper', 'The system could not continue', '#f02929', 'times', 8000);

            return setTimeout(startSearch(), 1000);
        }

        forceReturn = 0;

        veh.click();

        setTimeout(function vehSite() {

            const citizenID = document.querySelectorAll('[placeholder="Zadejte jméno / Citizen ID..."]')[0];
            const submitBtn = document.getElementsByTagName('button')[1];

            if (!citizenID || !submitBtn) {
                forceReturn++;
                if (forceReturn > 3) return notify('Police Helper', 'The system could not continue', '#f02929', 'times', 8000);

                return setTimeout(vehSite(), 1000);
            }

            forceReturn = 0;

            citizenID.value = searchedCitizenID;
            citizenID.dispatchEvent(new Event('input'));
            submitBtn.click();

            setTimeout(function getFirstIncident() {
                const firstID = document.getElementsByClassName('incident')[0];

                if (!firstID) {
                    forceReturn++;
                    if (forceReturn > 3) return notify('Police Helper', 'The system could not continue', '#f02929', 'times', 8000);

                    return setTimeout(getFirstIncident(), 1000);
                }

                forceReturn = 0;

                firstID.click();

                setTimeout(function specificCitizenVeh() {
                    let actualPoints = document.getElementsByClassName('licensePoints')[1];
                    let editPointsBtn = [...document.getElementsByClassName('btn')].find(btn => btn.innerHTML.includes('SPRAVOVAT BODY'));
                    let resultName = document.getElementsByClassName('resultQuery')[0];
                    let suspended = [...document.getElementsByTagName('span')].find(span => span.innerHTML.includes('Active') || span.innerHTML.includes('Suspend'));

                    if (!actualPoints || !editPointsBtn || !resultName) {
                        forceReturn++;
                        if (forceReturn > 3) return notify('Police Helper', 'The system could not continue', '#f02929', 'times', 8000);

                        return setTimeout(specificCitizenVeh(), 1000);
                    }

                    forceReturn = 0;

                    actualPoints = Number(actualPoints.innerHTML.replace(' / 12', ''));
                    resultName = resultName.innerHTML.split(' | ')[0];

                    editPointsBtn.click();

                    setTimeout(function removingPoints() {
                        let ptnMinus = [...document.getElementsByClassName('pointsBtn')][1];
                        let submit = [...document.getElementsByClassName('btn')].find(btn => btn.innerHTML.includes('POTVRDIT'));

                        if (!ptnMinus || !submit) {
                            forceReturn++;
                            if (forceReturn > 3) return notify('Police Helper', 'The system could not continue', '#f02929', 'times', 8000);

                            return setTimeout(removingPoints(), 1000);
                        }

                        forceReturn = 0;

                        for (let i = 0; i < pointsToRemove + (12 - actualPoints); i++) {
                            ptnMinus.click();
                        }

                        submit.click();

                        setTimeout(function criminalSearch() {
                            const crim = document.querySelectorAll('[routerlink="/search_criminals"]')[0];

                            if (!crim) {
                                forceReturn++;
                                if (forceReturn > 3) return notify('Police Helper', 'The system could not continue', '#f02929', 'times', 8000);

                                return setTimeout(criminalSearch(), 1000);
                            }

                            forceReturn = 0;

                            crim.click();

                            setTimeout(function () {
                                searchCitizen(searchedCitizenID);
                                showActualPoints(actualPoints - pointsToRemove, resultName);
                                if(!suspended.innerHTML === 'Active') notify('Police Helper', `Driver ${resultName} has a suspended driver's license`, '#fc8c03', 'exclamation-triangle', 8000);
                            }, 350);
                        }, 350);
                    }, 350);
                }, 350);
            }, 350);
        }, 350);
    }, 500);
}

function showActualPoints(ptn, name) {
    let dlAlert = '', suspend = false;

    if (ptn <= 0) {
        ptn = 0;
        suspend = true;
        dlAlert = `It is possible to suspend\n${name}'s driving license`;
    }

    const finalPoints = `${ptn} / 12`;
    notify('Police Helper', `Driver ${name} currently has\n${finalPoints} points`, '#42bcf5', 'info-circle', 8000);

    if (suspend === true) notify('Police Helper', dlAlert, '#f02929', 'exclamation-triangle', 8000);
}
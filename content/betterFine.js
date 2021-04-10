let searchedCitizenID;

function getCitizenID() {
    searchedCitizenID = Number(document.getElementsByClassName('resultQuery')[0].innerHTML.split(' | ')[1]);
}

function searchCitizen(id) {
    let forceReturn = 0;

    setTimeout(function errorHandler() {
        const searchInput = document.getElementById('name');
        const submitBtn = [...document.getElementsByTagName('button')].find(btn => btn.innerText === 'VYHLEDAT');
        const reasonField = document.getElementById('reason');
        
        if (!searchInput || !submitBtn || !searchedCitizenID || reasonField) { 
            forceReturn++;
            
            if(forceReturn > 3) return notify('Police Helper', 'The system could not continue searching', '#f02929', 'times', 8000);
            return errorHandler(); 
        }

        forceReturn = 0;
        searchInput.value = id;
        searchInput.dispatchEvent(new Event('input'));

        submitBtn.click();

        setTimeout(function getFirstincident() {
            const firstResult = document.getElementsByClassName('incident')[0];

            if (!firstResult) { 
                forceReturn++; 
                
                if(forceReturn > 3) return notify('Police Helper', 'The system could not continue searching', '#f02929', 'times', 8000);
                return setTimeout(getFirstincident, 1000); 
            }
    
            firstResult.click();
        }, 300);
    }, 500);
}
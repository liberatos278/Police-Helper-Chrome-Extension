function searchFine(name) {

    //Deleting diacritics and adding text to lower case
    name = name.toLowerCase();
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    console.log("I'm looking for the most likely answer...");

    const nameArray = name.split(/ +/);
    let resultArray = [];

    //Finding if text has more than one word
    if (nameArray.length > 1) {
        nameArray.forEach(word => {
            const sessionData = allData.filter(obj => obj.tags.includes(word));

            resultArray = resultArray.concat(sessionData);
        });

    //Finding if text is only one word
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

    //Deleting duplicates and set presumed index
    unique = [...new Set(resultArray)];

    unique = unique.sort((a, b) => {
        const aIndex = resultArray.filter(obj => obj.law === a.law).length;
        const bIndex = resultArray.filter(obj => obj.law === b.law).length;

        if (aIndex > bIndex) return -1;
        if (aIndex < bIndex) return 1;
        return 0;
    });

    console.log("I'm checking the search results");

    //Editing web page 
    editHTML(unique);
}
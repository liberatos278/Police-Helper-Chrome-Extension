// chrome.tabs.onActivated.addListener(tab => {
//     chrome.tabs.get(tab.tabId, currentTabInfo => {
//         if(currentTabInfo.url == 'https://mdt.swrp.cz/search_criminals') {
//             chrome.tabs.executeScript(null, {file: 'main.js'}, () => console.log('Injected'));
//         }
//     });
// });
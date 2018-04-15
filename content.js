//function inject(list) {

//    return Promise.all(list.map(item => new Promise((resolve, reject) => {
//        chrome.tabs.executeScript(null, item, () => {
//            if (chrome.runtime.lastError) {
//                reject(chrome.runtime.lastError);
//            } else {
//                resolve();
//            }
//        });
//    })));
//}
console.log("hit content");
//chrome.runtime.sendMessage({ text: "page loaded" }, function (response) { console.log("message received by content"); console.log(response.message); });

// 2018 Matthew Nicholson Beer
// MIT License: see license file for more detail
// 2018 Matthew Nicholson Beer
// MIT License: see license file for more detail

//var settings = {};
//settings.he = settings.he || "o";
//settings.she = settings.she || "o";
//settings.him = settings.him || "om";
//settings.her = settings.her || "om";
//settings.his = settings.his || "oz";
//settings.hers = settings.hers || "oz";

getSettings()
    .then(function (settings) {
        noNounReplace(settings);
    })


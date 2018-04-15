// 2018 Matthew Nicholson Beer
// MIT License: see license file for more detail


    // storage key
    var key = 'lastSettings';

    var stripNonLetters = function (str) {
        return str.replace(/[^a-zA-Z]/, "");
    }

    var fillDefaultSettings = function (settings) {
        settings.he = settings.he || "o";
        settings.she = settings.she || "o";
        settings.him = settings.him || "om";
        settings.her = settings.her || "om";
        settings.his = settings.his || "oz";
        settings.hers = settings.hers || "her";
        return settings;
    }

    // get user's last choices from storage
    var getSettings = function () {
        return new Promise(function (resolve, reject) {
            if (chrome.storage) {
                chrome.storage.sync.get(key, function (result) {
                    if (chrome.runtime.error) {
                        alert("Runtime error.");
                        console.log("Runtime error.");
                    }
                    // fill in with default values if previous user choices
                    // do not exist
                    settings = fillDefaultSettings(result.lastSettings || {});
                    resolve(settings);
                });
            }
            else {
                settings = fillDefaultSettings({});
                resolve(settings);
            }
        });
    }


    // store the user's choices for next time
    var setSettings = function (newSettings) {
        if (chrome.storage) {
            chrome.storage.sync.set({ 'lastSettings': newSettings }, function () {
                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                }
            });
        }
    };

     // Execuate a list of code snippets and javascript files
    function inject(list) {

        return Promise.all(list.map(item => new Promise((resolve, reject) => {
            chrome.tabs.executeScript(null, item, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        })));
    }

    finishUp = function (result) {
    }

    var go = function () {
        console.log("Starting...");
        var list = [
            { code: 'alert("injecting");' },
            { code: 'var noNoun = {}; noNoun.g = ' + JSON.stringify(settings) + ';' },
            { file: 'words.js' },
            { file: 'nonoun-inject.js' }
        ];
        inject(list)
        .then(function (result) { })
        .catch(err => {
            alert(`Error occurred: ${err}`);
            console.error(`Error occurred: ${err}`);
        });
    }

    // Listen for injected code to report that it is done
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        sendResponse({ message: "message received from content" });
        if (message.text === "page loaded") {
            console.log("message received from content");
            go();
        }
    });

    // Get user's last settings from storage - if they exist. Then
    // fill those values - or defaults, if the values do not exist -
    // into the text boxes to show user.
    getSettings()
        .then(function (settings) {
            fillSettings(settings);
        })



// 2018 Matthew Nicholson Beer
// MIT License: see license file for more detail
(function () {

    // storage key
    var key = 'lastSettings';

    var me = window;

    var closeWin = document.getElementById("CloseIcon");
    closeWin.addEventListener('click', function () { window.close(); });

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


    // Fill text boxes with initial values. User can then
    // change those values as desired.
    var fillSettings = function(settings) {
        document.getElementById('HeReplacement').value = settings.he;
        document.getElementById('SheReplacement').value = settings.she;
        document.getElementById('HimReplacement').value = settings.him;
        document.getElementById('HerReplacement').value = settings.her;
        document.getElementById('HisReplacement').value = settings.his;
        document.getElementById('HersReplacement').value = settings.hers;
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

    // Return all the user's choices in one object
    var getUserValues = function () {
        var heReplacement = document.getElementById('HeReplacement').value;
        var sheReplacement = document.getElementById('SheReplacement').value;
        var himReplacement = document.getElementById('HimReplacement').value;
        var herReplacement = document.getElementById('HerReplacement').value;
        var hisReplacement = document.getElementById('HisReplacement').value;
        var hersReplacement = document.getElementById('HersReplacement').value;
        var g = {
            he: heReplacement, him: himReplacement, his: hisReplacement,
            she: sheReplacement, her: herReplacement, hers: hersReplacement,
        };
        // Don't allow users to input numbers, spaces, or special characters - letters only
        Object.keys(g).forEach(function (key) {
            g[key] = stripNonLetters(g[key]);
        });
        return g;
    }

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
        window.close();
    }

    // Listen for injected code to report that it is done
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.text === "done") {
            finishUp();
        }
    });

    // Add a click event to the "Go" button
    document.addEventListener('DOMContentLoaded', function () {
        var GoGnothButton = document.getElementById('GoGnothButton');
        GoGnothButton.addEventListener('click', function () {
            console.log("Starting...")
            var spinner = document.getElementById("WaitSpinner");
            spinner.style.visibility = "visible";
            var g = getUserValues();   // get user's choices
            setSettings(g);            // save user choices for next time
            // Now go do it!!
            var list = [
                { code: 'var gnoth = {}; gnoth.g = ' + JSON.stringify(g) + ';' },
                { file: 'words.js' },
                { file: 'gnoth-inject.js'}
            ];
            inject(list)
            .then(function (result) {spinner.style.visibility = "hidden"; })
            .catch(err => {
                spinner.style.visibility = "hidden";
                alert(`Error occurred: ${err}`);
                console.error(`Error occurred: ${err}`);
            });;
        }, false);
        // Uncomment to debug
        //var saveButton = document.getElementById('SaveSettings');
        //saveButton.addEventListener('click', function () {
        //    var g = getUserValues();   // get user's choices
        //    setSettings(g);            // save user choices for next time
        //}, false);
        //var getButton = document.getElementById('GetSettings');
        //getButton.addEventListener('click', function () {
        //    getSettings()
        //        .then(function (settings) {
        //            document.getElementById('storageDisplay').innerText = JSON.stringify(settings);
        //        })
        //}, false);
    }, false);

    // Get user's last settings from storage - if they exist. Then
    // fill those values - or defaults, if the values do not exist -
    // into the text boxes to show user.
    getSettings()
        .then(function (settings) {
            fillSettings(settings);
        })
 
})();


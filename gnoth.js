(function () {

    var key = 'lastSettings';

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
                    //alert(JSON.stringify(settings));
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
                //alert(JSON.stringify(newSettings));
                if (chrome.runtime.error) {
                    alert("Runtime error.");
                    console.log("Runtime error.");
                }
                //console.log('Value is set to ' + JSON.stringify(newSettings));
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
        return g;
    }

    // Add a click event to the "Go" button
    document.addEventListener('DOMContentLoaded', function () {
        var GoGnothButton = document.getElementById('GoGnothButton');
        GoGnothButton.addEventListener('click', function () {
            var g = getUserValues();   // get user's choices
            setSettings(g);            // save user choices for next time
            // Now go do it!!
            chrome.tabs.executeScript(null, {
                code: 'var gnoth = {}; gnoth.g = ' + JSON.stringify(g) + ';'
            }, function () {
                chrome.tabs.executeScript(null, { file: 'gnoth-inject.js' }, function () { window.close();});
            });
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


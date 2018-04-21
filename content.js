// 2018 Matthew Nicholson Beer
// MIT License: see license file for more detail

function runTransform(settings) {
    if (settings.auto === "manual") {
        // do not run now; wait for user to explicitly run
        return false;
    }
    var currentUrl = window.location.href.toLowerCase();
    // see if item is in the exception list
    var found = settings.urls.find(function (url) {
        return currentUrl.indexOf(url.toLowerCase()) >= 0;
    });
    if (found && settings.auto === "off") {
        return true;
    } else if (!found && settings.auto === "on") {
        return true;
    }
    return false;
}

getSettings()
    .then(function (settings) {
        if (runTransform(settings)) {
            noNounReplace(settings);
        }
    })

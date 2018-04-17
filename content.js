// 2018 Matthew Nicholson Beer
// MIT License: see license file for more detail

function runTransform(settings) {
    var url = window.location.href.toLowerCase();
    for (var ii = 0; ii < settings.rules.length; ii++) {
        rule = settings.rules[ii];
        ruleUrl = settings.rule.toLowerCase();
        if (ruleUrl = "[all]" || url.indexOf(ruleUrl) >= 0) {
            if (rule.run === "no") {
                return false;
            }
            else if (rule.run === "yes") {
                return true;
            }
        }
    }
    return false;
}

getSettings()
    .then(function (settings) {
        if (runTransform(settings)) {
            noNounReplace(settings);
        }
    })

// 2018 Matthew Nicholson Beer
// MIT License: see license file for more detail
var articlesList = articles.join("|");
var adverbList = irregularAdverbs.join("|");
var prepositionList = prepositions.join("|");
var possessivesList = possessives.join("|");

// storage key
var key = 'lastSettings';

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

var fillDefaultSettings = function (settings) {
    settings.he = settings.he || "o";
    settings.she = settings.she || "o";
    settings.him = settings.him || "om";
    settings.her = settings.her || "om";
    settings.his = settings.his || "oz";
    settings.hers = settings.hers || "oz";
    settings.auto = "off";
    //settings.urls = ["en.wikipedia.org/wiki/RuPaul"];
    settings.urls = [ "washingtonpost.com", "Vox.com" ];
    return settings;
}

function noNounReplace(g) {
    JSON.stringify(g);
    var elements = document.getElementsByTagName('*');

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];

            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var replacedText = noNounReplaceOne(g, text);

                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
    console.log("NoNoun replacements done.");
    // This message doesn't get delivered until the background js
    // finishes its stuff. So we put in a delay here.
    if (chrome && chrome.runtime) {
        setTimeout(function () {
               chrome.runtime.sendMessage({ text: "done" }, function (response) {
                    // uncomment to debug
                    //console.log("response");
                });
            }, 1000);
    }
}

function noNounReplaceOne(g, text) {
    var replacedText = text;
    if (g.he) {
        //var regex = new RegExp("\b" + g.he + "\b", "ig");
        //replacedText = text.replace(regext, g.he);
        replacedText = replacedText.replace(/\bhe\b/g, g.he);
        replacedText = replacedText.replace(/\bHe\b/g, firstLetterToUpper(g.he));
        replacedText = replacedText.replace(/\bHE\b/g, g.he.toUpperCase());
        replacedText = replacedText.replace(/\bshe\b/g, g.she);
        replacedText = replacedText.replace(/\bShe\b/g, firstLetterToUpper(g.she));
        replacedText = replacedText.replace(/\bSHE\b/g, g.she.toUpperCase());
        replacedText = replacedText.replace(/\bhim\b/g, g.him);
        replacedText = replacedText.replace(/\bHim\b/g, firstLetterToUpper(g.him));
        replacedText = replacedText.replace(/\bHIM\b/g, g.him.toUpperCase());
        replacedText = replacedText.replace(herObjectRexExp('her'), g.her);
        replacedText = replacedText.replace(herObjectRexExp('Her'), firstLetterToUpper(g.her));
        replacedText = replacedText.replace(herObjectRexExp('HER'), g.her.toUpperCase());
        //replacedText = replacedText.replace(/\bto\sher\b/g, 'to ' + g.her);
        //replacedText = replacedText.replace(/\bto\sHer\b/g, 'to ' + firstLetterToUpper(g.her));
        //replacedText = replacedText.replace(/\bto\sHER\b/g, 'to ' + g.her.toUpperCase());
        replacedText = replacedText.replace(/\bhis\b/g, g.his);
        replacedText = replacedText.replace(/\bHis\b/g, firstLetterToUpper(g.his));
        replacedText = replacedText.replace(/\bHIS\b/g, g.his.toUpperCase());
        //replacedText = replacedText.replace(/(?!.*\bto\b)\bher\b/g, g.hers);
        //replacedText = replacedText.replace(/(?!.*\bto\b)\bHer\b/g, firstLetterToUpper(g.hers));
        //replacedText = replacedText.replace(/(?!.*\bto\b)\bHER\b/g, g.hers.toUpperCase());
        replacedText = replacedText.replace(/\bhers?\b/g, g.hers);
        replacedText = replacedText.replace(/\bHers?\b/g, firstLetterToUpper(g.hers));
        replacedText = replacedText.replace(/\bHERS?\b/g, g.hers.toUpperCase());
    }
    return replacedText;
}

function firstLetterToUpper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function herObjectRexExp(word) {
    var str = `\\b${word}\\b(?=[:.,;:?!]|\\s\\b(${articlesList}|${possessivesList}|$prepositionList}|${adverbList})|\\s\\b[a-zA-Z\\-]+ly\\b)`;
    return new RegExp(str, 'g');
}

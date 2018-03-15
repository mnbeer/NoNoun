document.addEventListener('DOMContentLoaded', function () {
    var GoGnothButton = document.getElementById('GoGnothButton');
    GoGnothButton.addEventListener('click', function () {
        var heReplacement = document.getElementById('HeReplacement').value;
        var sheReplacement = document.getElementById('SheReplacement').value;
        var himReplacement = document.getElementById('HimReplacement').value;
        var herReplacement = document.getElementById('HerReplacement').value;
        var hisReplacement = document.getElementById('HisReplacement').value;
        var hersReplacement = document.getElementById('HersReplacement').value;
        var g = {
            he: heReplacement, him: himReplacement, his: hisReplacement,
            she: heReplacement, her: himReplacement, hers: hisReplacement,
        };

        chrome.tabs.executeScript(null, {
            code: 'var gnoth = {}; gnoth.g = ' + JSON.stringify(g) + ';'
        }, function () {
            chrome.tabs.executeScript(null, { file: 'gnoth-inject.js' });
        });

    }, false);
}, false);


//function gnothReplace(g)
//{
//    var elements = document.getElementsByTagName('*');

//    for (var i = 0; i < elements.length; i++) {
//        var element = elements[i];

//        for (var j = 0; j < element.childNodes.length; j++) {
//            var node = element.childNodes[j];

//            if (node.nodeType === 3) {
//                var text = node.nodeValue;
//                var replacedText = gnothReplaceOne(g, text);

//                if (replacedText !== text) {
//                    element.replaceChild(document.createTextNode(replacedText), node);
//                }
//            }
//        }
//    }
//}

//function gnothReplaceOne(g, text) {
//    var replacedText = text;
//    if (g.he) {
//        var regex = new RegExp("\b" + g.he + "\b", "ig");
//        replacedText = text.replace('\bhe\b/gi', g.he);
//    }
//    return replacedText;
//}

//var elements = document.getElementsByTagName('*');

//for (var i = 0; i < elements.length; i++) {
//    var element = elements[i];

//    for (var j = 0; j < element.childNodes.length; j++) {
//        var node = element.childNodes[j];

//        if (node.nodeType === 3) {
//            var text = node.nodeValue;
//            var replacedText = text.replace(/[word or phrase to replace here]/gi, '[new word or phrase]');

//            if (replacedText !== text) {
//                element.replaceChild(document.createTextNode(replacedText), node);
//            }
//        }
//    }
//}


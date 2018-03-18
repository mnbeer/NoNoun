// 2017 Matthew Nicholson Beer
// MIT License: see license file for more detail
(function (g) {


    function gnothReplace(g) {
        JSON.stringify(g);
        var elements = document.getElementsByTagName('*');

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];

            for (var j = 0; j < element.childNodes.length; j++) {
                var node = element.childNodes[j];

                if (node.nodeType === 3) {
                    var text = node.nodeValue;
                    var replacedText = gnothReplaceOne(g, text);

                    if (replacedText !== text) {
                        element.replaceChild(document.createTextNode(replacedText), node);
                    }
                }
            }
        }
    }

    function gnothReplaceOne(g, text) {
        var replacedText = text;
        //alert(text + " " + g.he);
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
        //alert(replacedText);
        return replacedText;
    }

    function firstLetterToUpper(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function herObjectRexExp(word) {
        var str = '\\b' + word + '\\b(?=[:.,;:?!]|\\s[to|of|under|over|before|after|at|a|an|the|that|this])';
        //var str = '\\b' + word + '\\b';
        console.log(str);
        return new RegExp(str, 'g');
    }

    gnothReplace(g);

})(gnoth.g);


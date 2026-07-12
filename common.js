// 2018 Matthew Nicholson Beer
// MIT License: see license file for more detail

const STORAGE_KEY = 'lastSettings';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'IFRAME']);

const articlesList    = articles.join('|');
const adverbList      = irregularAdverbs.join('|');
const prepositionList = prepositions.join('|');
const possessivesList = possessives.join('|');

function getSettings() {
    return new Promise((resolve) => {
        if (chrome.storage) {
            chrome.storage.sync.get(STORAGE_KEY, (result) => {
                if (chrome.runtime.lastError) {
                    console.warn('NoNoun storage error:', chrome.runtime.lastError);
                }
                resolve(fillDefaultSettings(result[STORAGE_KEY] || {}));
            });
        } else {
            resolve(fillDefaultSettings({}));
        }
    });
}

function fillDefaultSettings(settings) {
    settings.he   = settings.he   || 'o';
    settings.she  = settings.she  || 'o';
    settings.him  = settings.him  || 'om';
    settings.her  = settings.her  || 'om';
    settings.his  = settings.his  || 'oz';
    settings.hers = settings.hers || 'oz';
    settings.auto = settings.auto || 'off';
    settings.urls = settings.urls || [];
    return settings;
}

function noNounReplace(g) {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                return SKIP_TAGS.has(node.parentElement?.tagName)
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    // Collect first to avoid modifying the tree during traversal
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const node of nodes) {
        const replaced = noNounReplaceOne(g, node.nodeValue);
        if (replaced !== node.nodeValue) {
            node.nodeValue = replaced;
        }
    }
    console.log('NoNoun replacements done.');
}

function noNounReplaceOne(g, text) {
    let t = text;
    t = t.replace(/\bhe\b/g,    g.he);
    t = t.replace(/\bHe\b/g,    capitalize(g.he));
    t = t.replace(/\bHE\b/g,    g.he.toUpperCase());
    t = t.replace(/\bshe\b/g,   g.she);
    t = t.replace(/\bShe\b/g,   capitalize(g.she));
    t = t.replace(/\bSHE\b/g,   g.she.toUpperCase());
    t = t.replace(/\bhim\b/g,   g.him);
    t = t.replace(/\bHim\b/g,   capitalize(g.him));
    t = t.replace(/\bHIM\b/g,   g.him.toUpperCase());
    // Match "her" as object pronoun (before punctuation, articles, prepositions, adverbs)
    // so it gets replaced differently from possessive "her/hers" below
    t = t.replace(herObjectRegExp('her'), g.her);
    t = t.replace(herObjectRegExp('Her'), capitalize(g.her));
    t = t.replace(herObjectRegExp('HER'), g.her.toUpperCase());
    t = t.replace(/\bhis\b/g,   g.his);
    t = t.replace(/\bHis\b/g,   capitalize(g.his));
    t = t.replace(/\bHIS\b/g,   g.his.toUpperCase());
    // "hers?" catches remaining possessive "her" and "hers"
    t = t.replace(/\bhers?\b/g, g.hers);
    t = t.replace(/\bHers?\b/g, capitalize(g.hers));
    t = t.replace(/\bHERS?\b/g, g.hers.toUpperCase());
    return t;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function herObjectRegExp(word) {
    const pat = `\\b${word}\\b(?=[:.,;?!]|\\s\\b(${articlesList}|${possessivesList}|${prepositionList}|${adverbList})|\\s\\b[a-zA-Z\\-]+ly\\b)`;
    return new RegExp(pat, 'g');
}

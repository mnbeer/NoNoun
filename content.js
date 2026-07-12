// 2018 Matthew Nicholson Beer
// MIT License: see license file for more detail

function shouldRunTransform(settings) {
    if (settings.auto === 'manual') return false;
    const currentUrl = window.location.href.toLowerCase();
    const matchesUrl = settings.urls.some(url => currentUrl.includes(url.toLowerCase()));
    // auto="on":  run everywhere EXCEPT the listed URLs
    // auto="off": run ONLY ON the listed URLs
    if (settings.auto === 'on')  return !matchesUrl;
    if (settings.auto === 'off') return matchesUrl;
    return false;
}

// Allow the popup's "Go!" button to trigger a replacement with fresh settings
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'replace') {
        noNounReplace(message.settings);
        sendResponse({ done: true });
    }
});

getSettings().then(settings => {
    if (shouldRunTransform(settings)) {
        noNounReplace(settings);
    }
});

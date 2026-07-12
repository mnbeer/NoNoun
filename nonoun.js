// 2018 Matthew Nicholson Beer
// MIT License: see license file for more detail

(function () {

    document.getElementById('CloseIcon').addEventListener('click', () => window.close());

    function stripToLetters(str) {
        return str.replace(/[^a-zA-Z]/g, '');
    }

    function createUrlInput(value = '') {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'exceptionUrl';
        input.placeholder = 'Type in full or partial address';
        input.value = value;
        input.addEventListener('blur', () => {
            addUrlInputIfNeeded();
            saveUserSettings();
        });
        return input;
    }

    function appendUrlInput(value) {
        document.getElementById('UrlList').appendChild(createUrlInput(value));
    }

    function hasEmptyUrlInput() {
        return Array.from(document.getElementsByName('exceptionUrl')).some(el => el.value === '');
    }

    function addUrlInputIfNeeded() {
        if (!hasEmptyUrlInput()) appendUrlInput('');
    }

    function fillSettings(settings) {
        document.getElementById('HeReplacement').value   = settings.he;
        document.getElementById('SheReplacement').value  = settings.she;
        document.getElementById('HimReplacement').value  = settings.him;
        document.getElementById('HerReplacement').value  = settings.her;
        document.getElementById('HisReplacement').value  = settings.his;
        document.getElementById('HersReplacement').value = settings.hers;
        document.querySelector(`input[name="auto"][value="${settings.auto}"]`).checked = true;
        settings.urls.forEach(url => appendUrlInput(url));
        appendUrlInput('');
    }

    function getUserValues() {
        const g = {
            he:   document.getElementById('HeReplacement').value,
            she:  document.getElementById('SheReplacement').value,
            him:  document.getElementById('HimReplacement').value,
            her:  document.getElementById('HerReplacement').value,
            his:  document.getElementById('HisReplacement').value,
            hers: document.getElementById('HersReplacement').value,
        };
        for (const key of Object.keys(g)) {
            g[key] = stripToLetters(g[key]);
        }
        g.auto = document.querySelector('input[name="auto"]:checked').value;
        g.urls = Array.from(document.getElementsByName('exceptionUrl'))
            .map(el => el.value.trim())
            .filter(v => v.length > 0);
        return g;
    }

    function setSettings(settings) {
        chrome.storage.sync.set({ [STORAGE_KEY]: settings }, () => {
            if (chrome.runtime.lastError) {
                console.warn('NoNoun storage error:', chrome.runtime.lastError);
            }
        });
    }

    function saveUserSettings() {
        const g = getUserValues();
        setSettings(g);
        return g;
    }

    function go() {
        const spinner = document.getElementById('WaitSpinner');
        spinner.classList.add('active');
        const g = saveUserSettings();

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs.length) {
                spinner.classList.remove('active');
                return;
            }
            chrome.tabs.sendMessage(tabs[0].id, { action: 'replace', settings: g }, () => {
                if (chrome.runtime.lastError) {
                    console.warn('NoNoun: content script not reachable.', chrome.runtime.lastError.message);
                }
                spinner.classList.remove('active');
                window.close();
            });
        });
    }

    document.getElementById('GoNoNounButton').addEventListener('click', go);

    document.getElementsByName('auto').forEach(btn =>
        btn.addEventListener('change', saveUserSettings)
    );

    document.querySelectorAll('[id$=Replacement]').forEach(input =>
        input.addEventListener('blur', saveUserSettings)
    );

    getSettings().then(fillSettings);

})();

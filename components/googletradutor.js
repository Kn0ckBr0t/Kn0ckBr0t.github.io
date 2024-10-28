function loadGoogleTranslateScript() {
    var script = document.createElement("script");
    script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: "pt",
            includedLanguages: "en,pt",
        },
        "google_translate_element"
    );

    setTimeout(addCustomTranslateListeners, 500);
}

function addCustomTranslateListeners() {
    document
        .getElementById("translate_en")
        .addEventListener("click", function (event) {
            event.preventDefault();
            setLanguage("en");
        });
    document
        .getElementById("translate_br")
        .addEventListener("click", function (event) {
            event.preventDefault();
            setLanguage("pt");
        });
}

function setLanguage(languageCode) {
    var translateSelectBox = document.querySelector(
        "#google_translate_element select"
    );
    if (translateSelectBox) {
        for (var i = 0; i < translateSelectBox.options.length; i++) {
            if (translateSelectBox.options[i].value === languageCode) {
                translateSelectBox.selectedIndex = i;
                translateSelectBox.dispatchEvent(new Event("change")); // Trigger the change event
                break;
            }
        }
    }
}

function changeColor(lang) {
    const enLink = document.getElementById('translate_en');
    const brLink = document.getElementById('translate_br');

    if (lang === 'en') {
        enLink.style.color = '#d1d1d1';
        brLink.style.color = '#8d8c8ce3';
    } else {
        enLink.style.color = '#8d8c8ce3';
        brLink.style.color = '#d1d1d1';
    }
}

document.addEventListener("DOMContentLoaded", loadGoogleTranslateScript);

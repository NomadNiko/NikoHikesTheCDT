(function () {
    if (window.eventCalendarAppScriptHasBeenRun) {
        return;
    }

    window.eventCalendarAppScriptHasBeenRun = true;

    var mainScript = document.createElement('script');
    mainScript.async = 1;
    mainScript.setAttribute('src', 'https://drux6c7e0s0bo.cloudfront.net/calendar-build/main.js?query=12345');
    document.head.appendChild(mainScript);

    var iconFontCSS = document.createElement('link');
    iconFontCSS.setAttribute('href', 'https://api.eventcalendarapp.com/calendar-build/iconfont.css');
    iconFontCSS.setAttribute('rel', 'stylesheet');
    document.head.appendChild(iconFontCSS);

    var stylesheet2 = document.createElement('link');
    stylesheet2.setAttribute('href', 'https://api.eventcalendarapp.com/cleanslate.css');
    stylesheet2.setAttribute('rel', 'stylesheet');
    document.head.appendChild(stylesheet2);

    var stylesheet = document.createElement('link');
    stylesheet.setAttribute('href', 'https://api.eventcalendarapp.com/calendar-build/styles.css');
    stylesheet.setAttribute('rel', 'stylesheet');
    document.head.appendChild(stylesheet);

})();

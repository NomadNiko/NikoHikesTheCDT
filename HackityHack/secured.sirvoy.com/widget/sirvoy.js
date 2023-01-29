/*
 * -----------------------------------------------------------------------------------------------------------------------
 * Sirvoy Booking Widget, (c) Sirvoy Ltd 2016-2023, All rights reserved.
 * -----------------------------------------------------------------------------------------------------------------------
 *
 * Usage:
 *
 * To include the booking widget on your page, just add the following html to your page:
 * <script async src="https://secured.sirvoy.com/widget/sirvoy.js" data-form-id="your-token-here"></script>
 *
 * The widget will be loaded via javascript and inserted at the position of the script-tag. You can have multiple booking
 * widgets at the same page if you want to. If you want to customize the widget you can also include some of the optional
 * attributes in the script-tag.
 *
 * Mandatory attributes:
 * -----------------------------------------------------------------------------------------------------------------------
 * data-form-id       The id for the booking form, you get this after logging in to your Sirvoy-account and choose
 *                    Settings > Your website > Booking forms.
 * -----------------------------------------------------------------------------------------------------------------------
 *
 * Optional attributes:
 * -----------------------------------------------------------------------------------------------------------------------
 * data-container-id            Customize the widget containers id-attribute. If not specified this will be automatically generated.
 * data-widget                  Specifies the widget type to render. Can be one of "normal" or "review". Defaults to "normal".
 * data-lang                    Sets the initial language of the widget. If not specified it will be assigned automatically.
 * data-callback                A javascript function in the global scope that will be called for events that occur.
 * data-target-confirmation-url To customize the url that the guest is redirected to after the booking process.
 * data-target-result-url       To customize the url that the guest is redirected to after doing a search in engine or review form.
 * data-context                 Tells the widget in what context it was loaded. Different contexts may force some settings.
 * data-source                  The source of a booking, in case of a channel is using the booking engine.
 * -----------------------------------------------------------------------------------------------------------------------
 *
 * Optional attributes for widget "normal" (booking widget)
 * -----------------------------------------------------------------------------------------------------------------------
 * data-code                    Coupon code to use for normal widget. If code url param is also given the later have preference.
 * data-category                Selected category for normal widget. If category url param is also given the later have preference.
 * data-adults                  Selected number of adults to search for. If adults url param is also given the later have preference.
 *
 * For these attributes data-check-in and data-check-out (or in combination with url parameters check_in/check_out) must BOTH be set.
 * If check-in and check-out are set all the following attributes can be used:
 *
 * data-check-in                Check-in date to use. If check_in url parameter is also given the later have preference.
 * data-check-out               Check-out date to use. If check_out url parameter is also given the later have preference.
 * data-target                  Target page, can be 'search' or 'results'. If target url parameter is also given the later have preference.
 * data-rooms                   JSON string to search in specific rooms. If rooms url parameter is also given that will take precedence.
 * -----------------------------------------------------------------------------------------------------------------------
 *
 * Host page query string parameters for widget "normal" (booking widget):
 * -----------------------------------------------------------------------------------------------------------------------
 * language          If this query string parameter is preset it will have precedence over data-lang.
 * code              Use specific booking code
 * category          Use specific category for booking
 * adults            Number of persons in the booking
 * rooms             JSON string to search in specific rooms
 *
 * For these parameters check_in and check_out (or in combination with attributes) must BOTH be set.
 * If check-in and check-out are set all the following parameters can be used:
 *
 * check_in          Date for check-in
 * check_out         Date for check-out
 * target            Target page, can be 'search' or 'results'
 * -----------------------------------------------------------------------------------------------------------------------
 *
 * Host page query string parameters for for widget review:
 * -----------------------------------------------------------------------------------------------------------------------
 * language          If this query string parameter is preset it will have precedence over data-lang.
 *
 * For these parameters booking_id and lastname are required. If not both are given they will not be used:
 *
 * booking_id        Booking ID to search for
 * lastname          Last name to search for
 * -----------------------------------------------------------------------------------------------------------------------
 *
 *
 * Debug:
 * -----------------------------------------------------------------------------------------------------------------------
 * To enable debug type in the browser console (it will be saved in local storage)
 *   SirvoyBookingWidget.debug.enable();
 * To disable debug again:
 *   SirvoyBookingWidget.debug.disable();
 * -----------------------------------------------------------------------------------------------------------------------
 *
 */

(function (global) {
    // we only want to run initialize code once
    var isInitialized = typeof global.SirvoyBookingWidget !== 'undefined';
    // initialize the variable so we don't run the init code again
    global.SirvoyBookingWidget = global.SirvoyBookingWidget || {};

    // only do this once, on the first run
    if (!isInitialized) {
        // Debug functions
        global.SirvoyBookingWidget.debug = {
            enabled: function () {
                // debug is disabled by default, load from local storage.
                try {
                    var r = window.localStorage.getItem('SirvoyBookingWidgetDebug');
                    if (null === r) {
                        r = false;
                    }
                } catch (e) {
                    r = false;
                }
                return r;
            },
            log: function (msg, dir) {
                if (this.enabled()) {
                    // log to console
                    console.log('-- ' + new Date().toJSON());
                    console.log('[DEBUG] Sirvoy Booking Widget: ' + msg);
                    // optional extra data
                    if (typeof (dir) !== 'undefined') {
                        console.dir(dir);
                    }
                }
            },
            enable: function () {
                // enable debug by setting it in localStorage
                window.localStorage.setItem('SirvoyBookingWidgetDebug', true);
                console.log('Sirvoy Booking Widget: Debug is enabled');
            },
            disable: function () {
                // disable debug by setting it in localStorage
                window.localStorage.removeItem('SirvoyBookingWidgetDebug');
                console.log('Sirvoy Booking Widget: Debug is disabled');
            }
        };

        // log init
        global.SirvoyBookingWidget.debug.log('Initializing booking widget.');


        // Register event listeners for events from iframe
        window.addEventListener('message', onMessage, false);


        //
        // Predefined functions we can call inside our widget
        //

        /**
         * Switch language on booking widget
         * @param language The language to switch to (two-letter code, like 'en', 'sv' etc)
         * @param container_id The container id to switch, required if custom id is used, will default to the first auto-named.
         */
        global.SirvoyBookingWidget.switchLanguage = function (language, container_id) {
            container_id = container_id || 'sbw_widget_1';

            // post message to the iframe to switch language
            var iframe = document.querySelector('#' + container_id + ' iframe');
            iframe.contentWindow.postMessage({
                event: 'switch_language',
                lang: language
            }, "https:\/\/secured.sirvoy.com");
        };

        /**
         * Resize booking widget
         * @param container_id The container id to switch, required if custom id is used, will default to the first auto-named.
         */
        global.SirvoyBookingWidget.resize = function (container_id) {
            container_id = container_id || 'sbw_widget_1';

            // post message to the iframe to switch language
            var iframe = document.querySelector('#' + container_id + ' iframe');
            iframe.contentWindow.postMessage({event: 'resize'}, "https:\/\/secured.sirvoy.com");
        };
    }




    // variables we use below
    var SirvoyBookingWidget = global.SirvoyBookingWidget;
    var debug = SirvoyBookingWidget.debug;

    // To keep track of which embeds we have already processed
    if (!SirvoyBookingWidget.processedScripts) {
        SirvoyBookingWidget.processedScripts = [];
    }
    var processedScripts = SirvoyBookingWidget.processedScripts;

    // Keep track of registered callbacks
    if (!SirvoyBookingWidget.userCallbacks) {
        SirvoyBookingWidget.userCallbacks = [];
    }
    var userCallbacks = SirvoyBookingWidget.userCallbacks;

    // Keep track of if tracking config per container
    if (!SirvoyBookingWidget.trackingConfig) {
        SirvoyBookingWidget.trackingConfig = {};
    }
    var trackingConfig = SirvoyBookingWidget.trackingConfig;

    //
    // finally, run the main function and return
    //

    main();
    return;













    // Used to extract parameters from host page
    function getUrlParam(name) {
        var location = new URL(window.location);
        return location.searchParams.get(name);
    }

    /*
     * Load a stylesheet - but only once
     */
    function loadSirvoyStylesheet(urls) {
        // we get all link tags (stylesheet) on the page and convert them to array
        var linkElements = document.getElementsByTagName('link')
        var linkElementsArray = Array.prototype.slice.call(linkElements, 0);

        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];

            // Look into the link-tags on the page to see if we (or the host page, think simple website) added it already
            // if this src already exists linkTagAlreadyAdded will be that link tag. If not linkTagAlreadyAdded
            // will be undefined
            var linkTagAlreadyAdded = linkElementsArray.find(function(s) { return s.href === url; });
            if (linkTagAlreadyAdded) {
                debug.log('loadSirvoyStylesheet found matching url already loaded. Will not load it another time: ' + url, linkTagAlreadyAdded);
                continue;
            }

            // so - this was not loaded before - load it
            var styleTag = document.createElement("link");
            styleTag.rel = "stylesheet";
            styleTag.type = "text/css";
            styleTag.href =  url;
            styleTag.media = "all";
            // Try to find the head, otherwise default to the documentElement
            (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(styleTag);

            // log message
            debug.log('loadSirvoyStylesheet found no matching url already loaded, loaded url: ' + url , styleTag);
        }
    }

    /*
     * Load a script - but only once
     */
    function loadSirvoyJavascript(urls) {
        // we get all script tags on the page and convert them to array
        var scriptsElements = document.getElementsByTagName('script')
        var scriptsElementsArray = Array.prototype.slice.call(scriptsElements, 0);

        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];

            // Look into the script-tags on the page to see if we (or the host page, think simple website) added it already
            // if this src already exists scriptTagAlreadyAdded will be that script tag. If not scriptTagAlreadyAdded
            // will be undefined
            var scriptTagAlreadyAdded = scriptsElementsArray.find(function(s) { return s.src === url; });
            if (scriptTagAlreadyAdded) {
                debug.log('loadSirvoyJavascript found matching url already loaded. Will not load it another time: ' + url, scriptTagAlreadyAdded);
                continue;
            }

            // so - this was not loaded before - load it
            var scriptTag = document.createElement('script');
            scriptTag.setAttribute("type", "text/javascript");
            scriptTag.setAttribute("src", url);
            // Try to find the head, otherwise default to the documentElement
            (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);

            // log message
            debug.log('loadSirvoyJavascript found no matching url already loaded, loaded url: ' + url, scriptTag);
        }
    }

    // To handle events from inside the iframe we have this function
    // we will get events about resize, tracking events, image gallery, etc.
    function onMessage(event) {
        // check origin - we don't care about messages from other origins than Sirvoy.
        // other js could be sending these, with an unknown format, and we do not like to continue in these cases.
        if (!event.origin.match(/^https:\/\/([a-z0-9\-\.]*\.sirvoy\.com)$/g)) {
            debug.log('onMessage, bad origin of message: "' + event.origin + '". We will not process this message.', event);
            return;
        }

        // We expect object data - some plugins / browsers send test string here like "canUsePostMessage" and
        // "setImmediate$0.04280013639340585$1". This is outside of our control and we ignore those strings.
        var msg = event.data;
        if (typeof msg !== 'object') {
            debug.log('onMessage, got invalid message (not an object): "' + event.data + '"', event);
            return;
        }

        // we are not interested in events that don't have the 'event' key - all sorts of plugins and browsers send
        // random events.
        if (msg.event === undefined) {
            debug.log('onMessage, got invalid message (missing event key): ' + JSON.stringify(msg), event);
            return;
        }

        // log event
        debug.log('onMessage, processing event:', event);


        // container_id is required in all events, if we don't get that something is wrong
        if (msg.container_id === undefined) {
            throw new Error('Sirvoy Booking Widget: Message missing container_id: ' + JSON.stringify(msg));
        }

        // page resize?
        if (msg.event === 'page_resize' && msg.height) {
            debug.log('onMessage, got resize event. ', msg);
            resizeWidget(msg.container_id, msg.height, msg.scroll);
            return;
        }

        // scroll into view (for iOS)
        if (msg.event === 'scrollIntoView' && msg.hasOwnProperty('top')) {
            debug.log('onMessage, got "scrollIntoView" event. ', msg);
            iosSafeScrollIntoView(msg.container_id, msg.top);
            return;
        }

        // engine debug message (from inside iframe)
        if (msg.event === 'engine_debug') {
            var text = typeof msg.text !== 'undefined' ? msg.text : '';
            debug.log('onMessage, engine_debug from iframe: ' + text, msg);
            return;
        }

        // tracking events intended for custom use by the customer, or built-in GA tracking / Facebook Pixel tracking
        // https://sirvoy.com/blog/topic/booking-engine/tracking/setting-up-google-analytics-event-tracking-for-your-booking-engine/
        // https://sirvoy.com/blog/topic/booking-engine/tracking/can-i-add-a-custom-script-for-event-tracking-in-the-booking-engine/
        if (msg.event === 'tracking_event') {
            debug.log('onMessage, got tracking_event. ', msg);

            // sanity check - we got the event object?
            if (typeof msg.tracking_event !== 'object') {
                throw new Error('Sirvoy Booking Widget: Got tracking_event but key "tracking_event" is not an object.');
            }

            // trackingEvent is the inner event we are going to send on to custom JS callback and/or GA
            var trackingEvent = msg.tracking_event;

            // sanity check - we have all the required keys?
            if (typeof trackingEvent.event !== 'string' ) {
                throw new Error('Sirvoy Booking Widget: Got tracking_event without expected key "tracking_event.event"');
            }
            if (typeof trackingEvent.container_id !== 'string' ) {
                throw new Error('Sirvoy Booking Widget: Got tracking_event without expected key "tracking_event.container_id"');
            }
            if (typeof trackingEvent.form_id !== 'string' ) {
                throw new Error('Sirvoy Booking Widget: Got tracking_event without expected key "tracking_event.form_id"');
            }

            // default is to run Google / Facebook tracking if defined, but returning false from user callback can disable that
            // on a case by case basis.
            var runThirdPartyTracking = true;
            // is there a defined userCallback, we call that with the event
            if (userCallbacks[trackingEvent.container_id]) {
                // call user function
                debug.log('Got tracking_event, JS callback for form_id: "' + trackingEvent.form_id + '", container_id: "' +
                    trackingEvent.container_id + '", event: "' + trackingEvent.event + '"', trackingEvent
                );
                try {
                    runThirdPartyTracking = userCallbacks[trackingEvent.container_id](trackingEvent);
                } catch (error) {
                    // if we get errors from customer script, we do not want to crash hard.
                    console.error('Sirvoy Booking Widget: Trying to run custom user callback but caught error for container ID: "' + trackingEvent.container_id + '"', trackingEvent, error);
                }
            }

            // if user defined callback returned false we do NOT run the Google Analytics or Facebook Pixel tracking
            if (runThirdPartyTracking === false) {
                return;
            }

            // is there a defined Google Analytics id for this container
            if ('google' in trackingConfig[trackingEvent.container_id]) {
                debug.log('Got tracking_event, GA callback for form_id: "' + trackingEvent.form_id + '", container_id: "' +
                    trackingEvent.container_id + '", event: "' + trackingEvent.event + '"', trackingEvent
                );

                try {
                    // Docs: https://developers.google.com/analytics/devguides/collection/gtagjs/events
                    SirvoyBookingWidget.googleGtagJsFunc('event', trackingEvent.event, {
                        // contains the G-... or UA-... id
                        'send_to': trackingConfig[trackingEvent.container_id].google,
                        'event_category': 'sirvoy_widget_booking',
                        'event_label': 'session',
                        'value': 0
                    });
                } catch (error) {
                    // if we get errors from GA we do not want to crash hard here, but we log an error to the console.
                    console.error('Sirvoy Booking Widget: Caught error when running GA send operation for container id: "' + trackingEvent.container_id + '"', trackingEvent, error);
                }
            }

            // is there a defined Facebook pixel id for this container?
            if ('facebook' in trackingConfig[trackingEvent.container_id]) {
                debug.log('Got tracking_event, Facebook pixel callback for form_id: "' + trackingEvent.form_id + '", container_id: "' +
                    trackingEvent.container_id + '", event: "' + trackingEvent.event + '"', trackingEvent
                );

                // Docs: https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking/#tracking-custom-events
                // Multiple trackers: https://developers.facebook.com/ads/blog/post/v2/2017/11/28/event-tracking-with-multiple-pixels-tracksingle/
                try {
                    fbq(
                        'trackSingleCustom',
                        trackingConfig[trackingEvent.container_id].facebook,
                        trackingEvent.event,
                        {}
                    );
                } catch (error) {
                    // if we get errors from GA we do not want to crash hard here, but we log an error to the console.
                    console.error('Sirvoy Booking Widget: Caught error when running Facebook fbq operation for container id: "' + trackingEvent.container_id + '"', trackingEvent, error);
                }
            }
            return;
        }


        // load hosted gallery (gallery_init)
        if (msg.event === 'gallery_init') {
            var loadGallery = true;
            if (userCallbacks[msg.container_id]) {
                // call user function
                debug.log('Running user-callback for gallery init: "' + msg.event + '"', msg);
                // if the user returns false - assume he will load the gallery in a customized way (do not load default js/css)
                loadGallery = userCallbacks[msg.container_id](msg);
            } else {
                // no defined user-callback.
                debug.log('Got event for gallery display: "' + msg.event + '". No callback defined.', msg);
            }

            // allow to customize the way it is displayed by returning false
            if (loadGallery !== false) {
                debug.log('Loading image gallery assets after gallery_init event because the customer has not opted out.');

                // load stylesheet for gallery
                loadSirvoyStylesheet(["https:\/\/cdn.sirvoy.com\/build-cdn\/modules\/images\/gallery-engine.c29ea47e.css"]);
                // load javascript for gallery
                loadSirvoyJavascript(["https:\/\/cdn.sirvoy.com\/build-cdn\/runtime.06370a68.js","https:\/\/cdn.sirvoy.com\/build-cdn\/modules\/images\/gallery-engine.0051ae26.js"]);
                return;
            }

            debug.log('Got false in response to our gallery_init event - we will assume it was our default gallery shouldn\'t be loaded.');
            return;
        }

        // open hosted gallery (gallery_open) - click from user
        if (msg.event === 'gallery_open') {
            var showGallery = true;
            if (userCallbacks[msg.container_id]) {
                // call user function
                debug.log('Running user-callback for gallery display: "' + msg.event + '"', msg);
                // if the user returns false, we will assume he handled it by himself.
                showGallery = userCallbacks[msg.container_id](msg);
            } else {
                // no defined user-callback.
                debug.log('Got event for gallery display: "' + msg.event + '". No callback defined.', msg);
            }

            // allow to customize the way it is displayed by returning false
            if (showGallery !== false) {
                debug.log('Displaying gallery using built-in solution');

                var dynamicElArray = [];

                msg.gallery.forEach(function(object) {
                    // https://sachinchoolur.github.io/lightGallery/docs/api.html
                    dynamicElArray.push({
                        src: object.image.url,
                        thumb: object.thumb.url,
                        subHtml: ' ' + object.title,
                        alt: ' ' + object.title
                    });
                });

                SirvoyBookingWidget.lightGallery.refresh(dynamicElArray);
                SirvoyBookingWidget.lightGallery.openGallery();

                return;
            }

            debug.log('Got false in response to our gallery_open event - we will assume it was handled and not display gallery here.');
            return;
        }

        // well, we should have returned by now
        throw new Error('Sirvoy Booking Widget: Unexpected message: ' + JSON.stringify(msg));
    }

    // Called from onMessage, resizes widget
    function resizeWidget(container_id, height, scroll) {
        var containerElement = document.getElementById(container_id);
        // we can't do anything unless the container is found (could be removed dynamically by other JS for example)
        if (!containerElement) {
            return;
        }

        // hide loader (we call this so early sometimes that we did not added the loader yet)
        var loaderElement = containerElement.querySelector('.sbw-loader');
        if (loaderElement) {
            loaderElement.style.display = 'none';
        }

        // we can't do anything if we do not have a frame. If we are missing form-id for example we will not.
        var iframeElement = containerElement.querySelector('iframe');
        if (!iframeElement) {
            return;
        }

        // adjust height
        iframeElement.style.height = height + 'px';

        if (scroll) {
            // get the rect to find out if the element is visible in viewport
            var rect = containerElement.getBoundingClientRect();

            // this will be only be true if the full element is visible in viewport, is this what we want?
            //var isInViewport = rect.top >= 0 &&
            //    rect.left >= 0 &&
            //    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            //    rect.right <= (window.innerWidth || document.documentElement.clientWidth);

            // check if the booking widget is in viewport, but don't care about scrolling if the element is going outside
            // of the viewport (too long) as long as the top left corner is showing (see commented code above for if
            // it is fully in viewport). We want to avoid scrolling if not absolutely necessary.
            var isTopInViewport = rect.top >= 0 && rect.left >= 0 && rect.right <= (window.innerWidth || document.documentElement.clientWidth);

            if (!isTopInViewport) {
                containerElement.scrollIntoView({behavior: "smooth"});
            }
        }
    }


    function iosSafeScrollIntoView(container_id, top) {
        var containerElement = document.getElementById(container_id);
        // we can't do anything unless the container is found (could be removed dynamically by other JS for example)
        if (!containerElement) {
            return;
        }
        // Find the top position of container on parent page
        var rect = containerElement.getBoundingClientRect();
        var containerTop = rect.top + window.scrollY;

        // Scroll down to the position for the element top we got relative in the container
        window.scrollTo(0,top + containerTop);
    }

    // display a fatal error to the user in the given element
    function displayFatalError(element, message) {
        element.innerHTML = '<div class="sbw-error"><p>' +
            '<strong>An error occurred!</strong>' +
            ' Sirvoy booking widget could not load! Error: ' +
            '<p class="pre">' + message + '</p></div>';
    }

    // Our main function
    function main() {
        var foundScriptTags = document.getElementsByTagName('script');
        var thisRequestUri = 'https\u003A\/\/secured.sirvoy.com\/widget\/sirvoy.js';

        for (var i = 0; i < foundScriptTags.length; i++) {
            var foundScriptTag = foundScriptTags[i];
            // src matches the uri of this request, and not processed it yet.
            if (foundScriptTag.src === thisRequestUri && processedScripts.indexOf(foundScriptTag) < 0) {
                processedScripts.push(foundScriptTag);
                // index of widget on page, counting from 1 and upwards
                var widgetId = processedScripts.length;

                // add the style tag into the head (once only)
                loadSirvoyStylesheet(["https:\/\/cdn.sirvoy.com\/build-cdn\/css\/widget-book.30032422.css"]);

                var widget_data = {}; // settings object

                var data_lang = getUrlParam('language') || foundScriptTag.getAttribute('data-lang');
                var data_widget = foundScriptTag.getAttribute('data-widget');
                var data_source = getUrlParam('source') || foundScriptTag.getAttribute('data-source');
                var data_callback = foundScriptTag.getAttribute('data-callback');
                var data_context = foundScriptTag.getAttribute('data-context');
                var data_container_id = foundScriptTag.getAttribute('data-container-id');
                var data_target_confirmation_url = foundScriptTag.getAttribute('data-target-confirmation-url');
                var data_target_result_url = foundScriptTag.getAttribute('data-target-result-url');
                var data_wp_plugin_version = foundScriptTag.getAttribute('data-wp-plugin-version');

                widget_data.container_id = data_container_id || 'sbw_widget_' + widgetId; // auto id if not provided
                widget_data.widget = data_widget || 'normal'; // 'normal' widget if not provided
                widget_data.source = data_source;
                widget_data.context = data_context || 'default'; // default if not provided. No special settings will be forced
                widget_data.source_tracking_id = null;

                // source Tripadvisor - add refid for TA tracking (specific to TA for now), if other sources
                // also sends a tracking id, we use widget_data.sourceTrackingId
                if (widget_data.source === 'tripadvisor' && getUrlParam('refid')) {
                    // http://developer-tripadvisor.com/connectivity-solutions/hotel-availability-check-api/documentation/s2s-conversion-tracking/#Receiving%20the%20RefID
                    widget_data.source_tracking_id = getUrlParam('refid');
                }

                // Mandatory attributes
                widget_data.form_id = foundScriptTag.getAttribute('data-form-id');

                // Optional general attributes
                if (data_lang) {
                    widget_data.lang = data_lang;
                }
                if (data_target_confirmation_url) {
                    widget_data.target_confirmation_url = data_target_confirmation_url;
                }
                if (data_target_result_url) {
                    widget_data.target_result_url = data_target_result_url;
                }

                // For widget 'normal':
                //   If host page parameters 'check_in', 'check_out' are present, we pass them along. The parameter
                //   'target' (one of 'results' or 'search') determines which view. If 'target' is not present, the 'results'
                //   view is the default.
                if (widget_data.widget === 'normal') {
                    // Optional attributes for normal widget
                    var data_code = getUrlParam('code') || foundScriptTag.getAttribute('data-code');
                    // FIXME! Here we also support the previously documented and deprecated url param "category_id". Remove this in time.
                    var data_category = getUrlParam('category') || getUrlParam('category_id') || foundScriptTag.getAttribute('data-category');
                    var data_adults = getUrlParam('adults') || foundScriptTag.getAttribute('data-adults');
                    var data_rooms = getUrlParam('rooms') || foundScriptTag.getAttribute('data-rooms');
                    var data_check_in = getUrlParam('check_in') || foundScriptTag.getAttribute('data-check-in');
                    var data_check_out = getUrlParam('check_out') || foundScriptTag.getAttribute('data-check-out');
                    var data_target = getUrlParam('target') || foundScriptTag.getAttribute('data-target');

                    if (data_code) {
                        widget_data.code = data_code;
                    }
                    if (data_category) {
                        widget_data.category = data_category;
                    }
                    if (data_adults) {
                        widget_data.adults = data_adults;
                    }
                    if (data_rooms) {
                        widget_data.rooms = data_rooms;
                    }
                    // checkin and checkout are mandatory parameters for the following parameters
                    if (data_check_in && data_check_out) {
                        widget_data.check_in = data_check_in;
                        widget_data.check_out = data_check_out;
                        widget_data.target = data_target || 'results'; // default to results-page if not given
                    }
                }

                // For widget 'review':
                //   If host page parameters 'booking_id', 'lastname' are present, we pass them along (both required).
                if (widget_data.widget === 'review') {
                    var search_params = {
                        b_id: getUrlParam('booking_id') || foundScriptTag.getAttribute('data-booking-id'),
                        lastname: getUrlParam('lastname') || foundScriptTag.getAttribute('data-lastname')
                    };
                    if (search_params.b_id && search_params.lastname) {
                        widget_data.search_params = search_params;
                    }
                }

                // special target 'confirmation' used by both widget review and normal to display the booking summary
                // in order to allow target confirmation a booking_token is required, and in that case we override any
                // other search parameters we would have used otherwise
                if (getUrlParam('target') === 'confirmation') {
                    widget_data.widget = 'confirmation';
                    widget_data.search_params = {};
                }

                // add host_page_url so we can link back to this page, for example after a finished payment
                widget_data.host_page_url = window.location.href;

                // callbacks - save for later
                userCallbacks[widget_data.container_id] = window[data_callback];

                // to be able to contact customers that use the JS callback we monitor usage
                if (data_callback !== null) {
                    widget_data.tracking_event_js_is_used = true;
                }

                // legacy versions of our wp plugin did not include the version, if we come from a WordPress site
                // and no version is set, set version to 'legacy'
                if (data_wp_plugin_version === null) {
                    var metaGenerator = document.querySelector("meta[name='generator']");
                    if (metaGenerator && metaGenerator.content.toLowerCase().startsWith('wordpress')) {
                        data_wp_plugin_version = 'legacy';
                    }
                }
                // include the version in the call so we can monitor usage (if we are from WordPress)
                if (data_wp_plugin_version !== null) {
                    widget_data.wp_plugin_version = data_wp_plugin_version;
                }

                // Create a div container
                var div = document.createElement('div');
                div.id = widget_data.container_id;
                div.className = 'sbw yui3-cssreset sbw_form_id_' + widget_data.form_id + ' sbw_id_' + widget_data.container_id;
                foundScriptTag.parentNode.insertBefore(div, foundScriptTag);

                // check mandatory parameters
                if (!widget_data.form_id) {
                    displayFatalError(div, 'The attribute "data-form-id" is mandatory, could not load widget.');
                    console.error('Sirvoy Booking Widget: The attribute "data-form-id" is mandatory, could not load', widget_data);
                    continue;
                }

                // Show loader
                div.innerHTML = '<img style="display: block; margin: 50px auto;" class="sbw-loader" alt="" src="data:image/gif;base64,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" />';

                (function(container, widget_data) {
                    // we set this variable in the first .then() so we have access to it in following .then() as well
                    // we run all this in try .. catch, so we can display a message for old browsers not supporting fetch API
                    var fetchResponse = null;
                    try {
                        var fetchUrl = new URL("https:\/\/secured.sirvoy.com\/widget\/book_widget_cors.js");
                        // we always pass booking token, if we have it this is the engine session we load (only required by confirmation right now)
                        var bookingToken = getUrlParam('booking_token');
                        if (bookingToken) {
                            fetchUrl.searchParams.set('t', bookingToken);
                        }

                        fetch(fetchUrl.toString(), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify(widget_data)
                        }).then(function(response) {
                            // save away the response so we can use it in the following .then()
                            fetchResponse = response;
                            // here we will check if we get JSON back and in that case return as an object for next .then()
                            // to process it, or in case it is not JSON, we convert the response to text.
                            var contentType = response.headers.get("content-type");
                            if (contentType && contentType.indexOf("application/json") !== -1) {
                                // it is json - process as an object in next .then()
                                return response.json();
                            } else {
                                // it is not json - process as text in next .then()
                                return response.text();
                            }
                        }).then(function (data) {
                            // if we get a string here, that is an error message, either from load balancer or one of the
                            // hard validations we do of the request
                            if (typeof data !== 'object') {
                                // throw error - we will catch in the .catch() below and display this error
                                throw new Error(
                                    'Unexpected response when loading Sirvoy booking widget. Got status code "' + fetchResponse.status +
                                    '" with non JSON response.'
                                );
                            }

                            // read status, default to error if not set
                            var status = data.status || 'error';
                            if (status !== 'ok') {
                                // throw error - we will catch in the .catch() below and display this error
                                var errorMessage = data.message || 'No error message given';
                                throw new Error(
                                    'Unexpected response when loading Sirvoy booking widget. Got status code "' + fetchResponse.status +
                                    '" with error message: "' + errorMessage + '"'
                                )
                            }

                            // Fill element with content
                            container.innerHTML = container.innerHTML + data.html;
                            // initial resize to speed things up - also will make sure a 404/500 error is displayed and hide the spinner
                            resizeWidget(widget_data.container_id, 300, false);

                            // save tracking config in our array for that per container id
                            trackingConfig[widget_data.container_id] = data.tracking_config;

                            // load Google analytic-code and run create if enabled by the customer
                            if ('google' in data.tracking_config) {
                                // we only load gtag/js once, docs: https://developers.google.com/tag-platform/devguides/install-gtagjs
                                if (typeof SirvoyBookingWidget.googleGtagJsFunc === 'undefined') {
                                    // log message
                                    debug.log('Loading gtag/js script...');

                                    try {
                                        // initialize gtag/js, instead of a function gtag() we use SirvoyBookingWidget.googleGtagJsFunc
                                        window.dataLayer = window.dataLayer || [];
                                        SirvoyBookingWidget.googleGtagJsFunc = function() { dataLayer.push(arguments); }
                                        SirvoyBookingWidget.googleGtagJsFunc('js', new Date());

                                        // load gtag/js
                                        var scriptTag = document.createElement('script');
                                        scriptTag.setAttribute('type', 'text/javascript');
                                        scriptTag.setAttribute('async', 'true');
                                        scriptTag.setAttribute('src', 'https://www.googletagmanager.com/gtag/js');
                                        // Try to find the head, otherwise default to the documentElement
                                        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
                                    } catch (error) {
                                        // if we get errors from GA we do not want to crash hard here, but we log an error to the console.
                                        console.error('Sirvoy Booking Widget: Got fatal error when loading gtag/js library.', error);
                                    }
                                }

                                // log message
                                debug.log(
                                    'Configuring gtag/js object for form_id: "' + widget_data.form_id + '", container_id: "' +
                                    widget_data.container_id + '", Google analytics id: "' + data.tracking_config.google + '"',
                                    data
                                );

                                try {
                                    // See: https://developers.google.com/tag-platform/gtagjs/routing#default_group
                                    // we set the group "sirvoy_widget" to avoid it to be added to the default group
                                    SirvoyBookingWidget.googleGtagJsFunc(
                                        'config',
                                        data.tracking_config.google,
                                        { 'send_page_view': false, 'groups': 'sirvoy_widget' }
                                    );
                                } catch (error) {
                                    // if we get errors from GA we do not want to crash hard here, but we log an error to the console.
                                    console.error('Sirvoy Booking Widget: Caught error when running configuring GA id: "' + data.tracking_config.google + '"', error);
                                }
                            }

                            // load Facebook Pixel tracking code if enabled by the customer
                            if ('facebook' in data.tracking_config) {
                                // log message
                                debug.log(
                                    'Creating Facebook pixel object for form_id: "' + widget_data.form_id + '", container_id: "' +
                                    widget_data.container_id + '", Facebook Pixel id: "' + data.tracking_config.facebook + '"',
                                    data
                                );

                                try {
                                    // Docs: https://developers.facebook.com/docs/facebook-pixel/get-started#base-code
                                    // https://developers.facebook.com/ads/blog/post/v2/2017/11/28/event-tracking-with-multiple-pixels-tracksingle/

                                    // Load FB events code (will only execute once)
                                    !function(f,b,e,v,n,t,s)
                                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                        n.queue=[];t=b.createElement(e);t.async=!0;
                                        t.src=v;s=b.getElementsByTagName(e)[0];
                                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                                        'https://connect.facebook.net/en_US/fbevents.js');

                                    // init the Facebook pixel id
                                    fbq('init', data.tracking_config.facebook);
                                } catch (error) {
                                    // if we get errors from Facebook pixel code we do not want to crash hard here, but we log an error to the console.
                                    console.error('Sirvoy Booking Widget: Caught error when running configuring Facebook Pixel id: "' + data.tracking_config.facebook + '"', error);
                                }
                            }
                        }).catch(function(error) {
                            displayFatalError(container, error.message);
                            console.error('Got error when loading Sirvoy booking widget: ', error);
                            debug.log('Unexpected response: ', fetchResponse);
                        });
                    } catch (error) {
                        // here we catch if browser is not supporting fetch API
                        displayFatalError(container, 'Fetch failed. You browser is probably too old and needs to be updated.');
                        // log message
                        debug.log('Got error when fetching data', error);
                    }

                })(div, widget_data); // run the above code in a closure so we can access the container in the callback
            }
        }
    } //main
})(this);

$.getScript("https://apis.google.com/js/client.js?onload=checkAuth", function() {
    
});


// // Client ID can be retrieved from the project in the Google
// Developer Console, https://console.developers.google.com
        var CLIENT_ID = '<CLIENT_ID>';

// We will be updating the Calendar, so we need the following
// auth scope
var SCOPES = ['https://www.googleapis.com/auth/calendar'];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    gapi.auth.authorize(
            {
                'client_id': CLIENT_ID,
                'scope': SCOPES,
                'immediate': true
            }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        
        // Hide auth UI, then load Calendar client library.
        authorizeDiv.style.display = 'none';
        loadCalendarApi();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
    gapi.auth.authorize(
            {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
    return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
    gapi.client.load('calendar', 'v3').then(function () {
        console.log('Google client api library loaded');
    });
}

"use strict";

const config = require('config');
const yahooFinance = require('yahoo-finance');
const { google } = require('googleapis');
const readline = require("readline");

console.log(google);
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const oAuth2Client = new OAuth2Client(config.get("client_id"), config.get("client_secret"), "urn:ietf:wg:oauth:2.0:oob");

const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
});

console.log('Authorize this app by visiting this url:\n');

console.log(authUrl + "\n");

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

r1.question("Enter the code from that page here: ", (code) => {
    r1.close();
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return callback(err);
        oAuth2Client.setCredentials(token);
        setUpdateInterval(oAuth2Client);
    });
});

function setUpdateInterval(auth) {
    const google_calendar = google.calendar({ version: "v3", auth });
    setInterval(() => {
        console.log(updateGoogleCalendar(google_calendar));
    }, config.get("update_interval"));
}

function updateGoogleCalendar(google_calendar) {
    for (const s of config.get("symbols")) {
        yahooFinance.quote({
            symbol: s,
            modules: ["calendarEvents"],
        }, (err, quotes) => {
            if (err) return err;
            console.log(quote.calendar);
        });
    }
    return "updated google calendar";
}

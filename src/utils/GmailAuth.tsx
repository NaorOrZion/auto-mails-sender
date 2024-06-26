// src/components/GmailAuth.js
import { useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID =
    "1049876237359-rvju9lfpr5c3egt7medntgh4lt3hpnmp.apps.googleusercontent.com";
const API_KEY = "AIzaSyAB9Ml2aaGyAh4cDxM7CipZoxQNq0NR1iI";
const SCOPES = "https://www.googleapis.com/auth/gmail.send";

const GmailAuth = () => {
    useEffect(() => {
        const initClient = () => {
            gapi.client
                .init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: [
                        "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
                    ],
                    scope: SCOPES,
                })
                .then(() => {
                    gapi.auth2
                        .getAuthInstance()
                        .isSignedIn.listen(updateSigninStatus);
                    updateSigninStatus(
                        gapi.auth2.getAuthInstance().isSignedIn.get()
                    );
                });
        };

        gapi.load("client:auth2", initClient);
    }, []);

    const updateSigninStatus = (isSignedIn: Boolean) => {
        if (isSignedIn) {
            console.log("User is signed in");
        } else {
            console.log("User is not signed in");
        }
    };

    const handleAuthClick = () => {
        gapi.auth2.getAuthInstance().signIn();
    };

    const handleSignOutClick = () => {
        gapi.auth2.getAuthInstance().signOut();
    };

    return (
        <div>
            <button onClick={handleAuthClick}>Sign In with Google</button>
            <button onClick={handleSignOutClick}>Sign Out</button>
        </div>
    );
};

export default GmailAuth;

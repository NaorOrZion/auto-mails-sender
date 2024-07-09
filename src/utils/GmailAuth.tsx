import { useState, useEffect } from "react";
import sendEmail from "./sendEmail";

// Declare the google namespace
declare const google: any;

const CLIENT_ID = "";
const SCOPES = "https://www.googleapis.com/auth/gmail.send";

/**
 * This component handles the Gmail authentication process
 * and saves the access token in local storage.
 * It also sends an email if the user is signed in and
 * a flag is set to auto-send an email.
 *
 * @params emails | Array of email addresses to send the email to
 * @params subject | String subject of the email
 * @params htmlResult | string HTML body of the email
 * @params setOpenSuccessEmail | Boolean state to open the success email dialog
 */
export default function GmailAuth({
    emails,
    subject,
    htmlResult,
    setOpenSuccessEmail,
    setIsSignedIn,
    setAccessToken,
    setTokenClient,
}: any) {
    const initClient = () => {
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (response: any) => {
                if (response.access_token) {
                    // Save the access token in local storage
                    localStorage.setItem("accessToken", response.access_token);
                    // Calculate and save the expiration time
                    // Assuming response.expires_in is the duration in seconds from now when the token expires
                    const expirationTime =
                        new Date().getTime() + response.expires_in * 1000;
                    localStorage.setItem(
                        "expirationTime",
                        expirationTime.toString()
                    );

                    setAccessToken(response.access_token);
                    setIsSignedIn(true);

                    console.log(
                        "Signed in successfully, sending an email. Emails:",
                        emails
                    );
                    // Check if we need to send an email immediately after signing in
                    if (localStorage.getItem("autoSendEmail") === "true") {
                        const requestResponse = await sendEmail(
                            emails.join(","),
                            subject,
                            htmlResult,
                            response.access_token, // Use the fresh token
                            setOpenSuccessEmail
                        );
                        console.log("The Request response", requestResponse);
                        localStorage.removeItem("autoSendEmail"); // Clear the flag after sending
                    }
                }
            },
        });
        setTokenClient(tokenClient);
    };

    // Attempt to use the cached access token
    const cachedToken = localStorage.getItem("accessToken");
    const expirationTime = localStorage.getItem("expirationTime");
    const currentTime = new Date().getTime();

    if (
        cachedToken &&
        expirationTime &&
        currentTime < parseInt(expirationTime)
    ) {
        // Token is valid
        setAccessToken(cachedToken);
        setIsSignedIn(true);
    } else {
        // Token is expired or not set, initiate sign-in process
        localStorage.removeItem("accessToken"); // Ensure stale token is removed
        localStorage.removeItem("expirationTime");
        if (typeof google !== "undefined") {
            initClient();
        } else {
            console.error("You need to sign in to your Google account first.");
        }
    }
}

/**
 * This function sends an email using the Gmail API.
 *
 * @params emails | Array of email addresses to send the email to
 * @params subject | String subject of the email
 * @params htmlResult | string HTML body of the email
 * @params setOpenSuccessEmail | Boolean state to open the success email dialog
 */
export async function handleSendEmailClick({
    emails,
    subject,
    htmlResult,
    setOpenSuccessEmail,
    isSignedIn,
    accessToken,
    tokenClient,
    setTextAlert,
    setStateAlert,
}: any) {
    // Call the function to send the email
    if (emails.length === 0) {
        setTextAlert("למי לשלוח את ההודעה?");
        setStateAlert("error");
        setOpenSuccessEmail(true);
    } else if (!subject) {
        setTextAlert("ככה לשלוח בלי נושא?");
        setStateAlert("error");
        setOpenSuccessEmail(true);
    } else if (!htmlResult) {
        setTextAlert("למה לשלוח הודעה ריקה?");
        setStateAlert("error");
        setOpenSuccessEmail(true);
    } else {
        if (isSignedIn) {
            // set the text alert to a success message
            setTextAlert("המייל נשלח בהצלחה!");
            setStateAlert("success");

            // Send the email
            await sendEmail(
                emails.join(","),
                subject,
                htmlResult,
                accessToken,
                setOpenSuccessEmail
            );
        } else {
            // Set a flag to auto-send the email after signing in
            localStorage.setItem("autoSendEmail", "true");

            // Request the access token
            tokenClient?.requestAccessToken();
        }
    }
}

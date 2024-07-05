import { encode } from "js-base64";

/**
 * This function sends an email using the Gmail API
 *
 * @param email | Email address to send the email to
 * @param subject | Subject of the email
 * @param body | Body of the email
 * @param accessToken | Access token to authenticate the request
 */
export default function sendEmail(
    email: string,
    subject: string,
    body: string,
    accessToken: string
) {
    // Encode the subject in base64 to handle non-ASCII characters
    const encodedSubject = `=?UTF-8?B?${encode(subject)}?=`;

    // Encode the message body in base64
    const encodedBody = encode(body);

    // Create the raw email message
    const rawMessage = [
        `Content-Type: text/html; charset="UTF-8"`,
        `MIME-Version: 1.0`,
        `Content-Transfer-Encoding: base64`,
        `to: ${email}`,
        `subject: ${encodedSubject}`,
        `\n${encodedBody}`,
    ].join("\n");

    const encodedMessage = encode(rawMessage)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    // Send the email using the access token
    fetch("https://www.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            raw: encodedMessage,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Email sent", data);
        })
        .catch((error) => {
            console.error("Error sending email", error);
        });
}

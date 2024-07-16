import { encode } from "js-base64";

/**
 * This function converts a base64 string to a Blob
 * @param b64Data | The base64 string to convert
 * @param contentType | The content type of the Blob
 * @param sliceSize | The slice size to use when converting
 * @returns | The Blob object
 */
function b64toBlob(
    b64Data,
    contentType,
    sliceSize = 512
) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}

/**
 * This function replaces all base64 images in the html body with
 * blobs and returns the new html body and a map of inline images.
 *
 * @param htmlBody | The html body of the email
 * @returns { newHtmlBody: string, inlineImages: { [key: string]: Blob } }
 */
function replaceBase64ImagesWithBlobs(htmlBody) {
    let newHtmlBody = htmlBody;
    const inlineImages = {};

    // Find all base64 image tags in the html message.
    const base64ImageTags =
        htmlBody.match(
            /<img\s+[^>]*src="data:image\/(png|jpeg|gif);base64,([^"]+)"[^>]*>/gm
        ) || [];

    base64ImageTags.forEach((base64ImageTag) => {
        // Attempt to extract the base64-encoded image data from the tag.
        const matchResult = base64ImageTag.match(
            /data:image\/(png|jpeg|gif);base64,([^"]+)/
        );

        if (matchResult) {
            const [, format, base64Data] = matchResult;

            // Create a blob containing the image data.
            const imageBlob = b64toBlob(base64Data, `image/${format}`);

            // Generate a unique image name.
            const imageName = "id" + Math.random().toString(16).slice(2);

            // Replace the base64 image tag with cid: image tag.
            const newImageTag = base64ImageTag.replace(
                /src="[^"]+"/,
                `src="cid:${imageName}"`
            );
            newHtmlBody = newHtmlBody.replace(base64ImageTag, newImageTag);

            inlineImages[imageName] = imageBlob;
        }
    });

    return { newHtmlBody, inlineImages };
}

/**
 * Converts a Blob to a Base64 string
 * @param blob | The Blob to convert
 * @returns | A Promise that resolves to the Base64 string
 */
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result?.toString().split(",")[1];
            if (base64data) {
                resolve(base64data);
            } else {
                reject(new Error("Failed to convert blob to base64"));
            }
        };
        reader.onerror = () => reject(new Error("FileReader error"));
        reader.readAsDataURL(blob);
    });
}

/**
 * This function sends an email chunk using the Gmail API
 * @param email (Array) | Email address to send the email to
 * @param subject (String) | Subject of the email
 * @param body (String) | Body of the email
 * @param accessToken (String) | Access token to authenticate the request
 * @param setOpenSuccessEmail | Function to set the success email state
 * @returns | A Promise that resolves when the email is sent
 */
async function sendEmailChunk(emails, subject, body, accessToken, setOpenSuccessEmail) {
    // Encode the subject in base64 to handle non-ASCII characters
    const encodedSubject = `=?UTF-8?B?${encode(subject)}?=`;

    // Replace base64 images with blobs and get the new html body and inline images
    const { newHtmlBody, inlineImages } = replaceBase64ImagesWithBlobs(body);

    // Create the MIME message with inline images
    const boundary = `boundary_${Math.random().toString(16).slice(2)}`;
    const parts = [
        `MIME-Version: 1.0`,
        `to: ${emails}`,
        `subject: ${encodedSubject}`,
        `Content-Type: multipart/related; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/html; charset="UTF-8"`,
        `Content-Transfer-Encoding: base64`,
        ``,
        encode(newHtmlBody),
    ];

    for (const [cid, blob] of Object.entries(inlineImages)) {
        const base64data = await blobToBase64(blob);
        parts.push(
            `--${boundary}`,
            `Content-Type: ${blob.type}`,
            `Content-Transfer-Encoding: base64`,
            `Content-ID: <${cid}>`,
            ``,
            base64data
        );
    }

    parts.push(`--${boundary}--`);

    const rawMessage = parts.join("\n");

    const encodedMessage = encode(rawMessage)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    // Send the email using the access token
    try {
        const response = await fetch(
            "https://www.googleapis.com/gmail/v1/users/me/messages/send",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    raw: encodedMessage,
                }),
            }
        );
        const data = await response.json();
        console.log(data);
        setOpenSuccessEmail(true);
    } catch (error) {
        console.error("Error sending email", error);
    }
}

/**
 * This function handles the sending of an email to multiple recipients
 * by chunking the recipients into groups of 100 and sending the email.
 *
 * @param email (Array) | Email address to send the email to
 * @param subject (String) | Subject of the email
 * @param body (String) | Body of the email
 * @param accessToken (String) | Access token to authenticate the request
 * @param setOpenSuccessEmail | Function to set the success email state
 */
export default async function sendEmail(
    emails,
    subject,
    body,
    accessToken,
    setOpenSuccessEmail
) {
    // Chunk the emails into groups of 100 recipients
    const max_recipients_per_message = 100;

    // Calculate the number of chunks
    const emailsChunks = Math.ceil(emails.length / max_recipients_per_message);

    // Send an email chunk for each group of recipients
    for (let i = 0; i < emailsChunks; i++) {
        // Slice the emails array to get the current chunk
        const emailsChunk = emails.slice(
            i * max_recipients_per_message,
            (i + 1) * max_recipients_per_message
        ).join(",");

        await sendEmailChunk(emailsChunk, subject, body, accessToken, setOpenSuccessEmail);
    }
}

import { gapi } from 'gapi-script';
import { encode } from 'js-base64';

// Function to encode non-ASCII email subjects according to RFC 2047
function encodeEmailSubject(subject: string): string {
  // Encode the subject in base64 to handle non-ASCII characters
  const base64Subject = encode(subject);
  // Return the encoded subject in the format =?charset?encoding?encoded text?=
  return `=?utf-8?B?${base64Subject}?=`;
}

export default function sendEmail(email: string, subject: string, body: string) {
  const encodedSubject = encodeEmailSubject(subject);

  const encodedMessage = encode(
    `Content-Type: text/html; charset="UTF-8"\n` +
    `MIME-Version: 1.0\n` +
    `Content-Transfer-Encoding: 7bit\n` +
    `to: ${email}\n` +
    `subject: ${encodedSubject}\n\n` +
    `${body}`
  ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  gapi.client.gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: encodedMessage
    }
  }).then((response: any) => {
    console.log('Email sent', response);
  }).catch((error: any) => {
    console.error('Error sending email', error);
  });
};
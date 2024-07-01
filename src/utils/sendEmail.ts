import { gapi } from 'gapi-script';
import { encode } from 'js-base64';

export default function sendEmail(email: string, subject: string, body: string) {
  const encodedSubject = encode(subject);

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
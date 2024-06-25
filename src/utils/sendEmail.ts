// sendEmails.ts
import { google } from 'googleapis';
import { Buffer } from 'buffer';

export default async function sendEmails(token: string, emails: string[], subject: string, body: string) {
  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({ access_token: token });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  for (const email of emails) {
    const emailContent = [
      `To: ${email}`,
      'Content-Type: text/html; charset=UTF-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');

    const base64EncodedEmail = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: base64EncodedEmail,
        },
      });
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
    }
  }
}

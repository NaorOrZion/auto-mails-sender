# Auto Mails Sender

Author: Naor Or-Zion

## What is the _Auto Mails Sender_?

Greetings!
This tool has been wrriten in order to send emails from google to a bunch of people at once.
The key feture here helps you to upload a bunch of emails addresses from excel.
Eventually the mail will be sent from your gmail account.

## How does it work?

Your google account will use OAuth2.0 in order to send emails on your behalf (your google account).
Once you grab the client id from the OAuth2 project and paste it in the project, you will be able to send emails.
Also you can upload emails addresses from excel in ease.

#### How to open a Google People API project?

Open google with the google account you synced your contacts with, than:
1.  Visit: https://console.cloud.google.com/apis/dashboard
2.  Open a new project.
3.  In the left bar: click on "Library".
4.  Search for "Gmail API" and enable the first package.
5.  In the left bar: click on "Credentials".
6.  Click on "Create credentials".
7.  Create an OAuth Client Id and pick a name for the project.
8.  Fill the consent screen (Ignore The logo and the domains, just go forward)
9.  When requested to fill the "Application type", pick Web Application and pick a name.
10. Click the new application you have created and add to "Authorized JavaScript origins" and "Authorized redirect URIs" the url of your website, for example: "http://mywebsite.com".
11.  Now copy the "Client ID".
12.  Place this in ""\src\utils" in the CLIENT_ID constant.
13.  Go to OAuth consent screen and click Publish App.

## How to use and initialize the website?

#### Prerequities

-   npm
-   Google Cloud Console Project

#### Installation

1. Clone the github project to a designated folder in your desktop.
```sh
git clone https://github.com/NaorOrZion/auto-mails-sender.git
```

2. Move to the cloned folder.
```sh
cd auto-mails-sender
```
    
3. Install libraries and requirements
```sh
npm i
```

5. Run the project (Notice that it will run on localhost).
```sh
npm start
```

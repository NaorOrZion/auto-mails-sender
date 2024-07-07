import RichTextEditorComponent from "./utils/RichTextEditorComponent";
import { Box, Button, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import MultiEmail from "./utils/MultipleEmailsInput";
import sendEmail from "./utils/sendEmail";
import UpperBar from "./UpperBar";

// Declare the google namespace
declare const google: any;

const CLIENT_ID = "1049876237359-rvju9lfpr5c3egt7medntgh4lt3hpnmp.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/gmail.send";

export default function PaperContent() {
    // This comopnent stores all the components in the paper

    const [htmlResult, setHtmlResult] = useState<string>("");
    const [emails, setEmails] = useState<string[]>([]);
    const [subject, setSubject] = useState<string>("");
    const [isSignedIn, setIsSignedIn] = useState<Boolean>(false);
    const [accessToken, setAccessToken] = useState<string>("");
    const [tokenClient, setTokenClient] =
        useState<google.accounts.oauth2.TokenClient | null>(null);

    useEffect(() => {
        const initClient = () => {
            const tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (response: any) => {
                    if (response.access_token) {
                        setAccessToken(response.access_token);
                        setIsSignedIn(true);
                    }
                },
            });
            setTokenClient(tokenClient);
        };

        if (typeof google !== "undefined") {
            initClient();
        } else {
            console.error("Google Identity Services library not loaded");
        }
    }, []);

    const handleSendEmailClick = async () => {

        if (isSignedIn) {
            sendEmail(
                emails.join(","),
                subject,
                htmlResult,
                accessToken
            );
        } else {
            tokenClient?.requestAccessToken();
        }
    };

    return (
        <>
            <UpperBar />
            <Box
                component="form"
                sx={{
                    width: "100%",
                    direction: "rtl",
                    textAlign: "right",
                    paddingRight: "1.8vw",
                    paddingLeft: "1.8vw",
                }}
                autoComplete="off"
                onSubmit={(event) => {
                    event.preventDefault();
                    handleSendEmailClick();
                }}
            >
                <MultiEmail
                    emails={emails}
                    setEmails={setEmails}
                />
                <TextField
                    className="mt-2 mb-3"
                    id="subject-textfield"
                    label="Subject"
                    variant="standard"
                    onChange={(e) => setSubject(e.target.value)}
                    fullWidth
                    required
                />
                <RichTextEditorComponent setHtmlResult={setHtmlResult} />

                <Divider sx={{ mt: 5, mb: 2 }} />

                <Button type="submit">Save and display HTML</Button>
            </Box>
        </>
    );
}

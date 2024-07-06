import RichTextEditorComponent from "./utils/RichTextEditorComponent";
import { Box, Button, Divider } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { RichTextEditorRef } from "mui-tiptap";
import MultiEmail from "./utils/MultipleEmailsInput";
import sendEmail from "./utils/sendEmail";
import { gapi } from "gapi-script";
import UpperBar from "./UpperBar";

// Declare the google namespace
declare const google: any;

const CLIENT_ID =
    "721700191832-1si8gdbp4f7pkmsugs85r2v8t4umd2hv.apps.googleusercontent.com";
const API_KEY = "AIzaSyBhkMoLMMRTh35Pk7SL_vx0Rz3286vkXU0";
const SCOPES = "https://www.googleapis.com/auth/gmail.send";

export default function PaperContent() {
    // This comopnent stores all the components in the paper

    const rteRef = useRef<RichTextEditorRef>(null);
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
        const newHtmlResult = (await rteRef.current?.editor?.getHTML()) ?? "";
        setHtmlResult(newHtmlResult);

        if (isSignedIn) {
            await sendEmail(
                emails.join(","),
                subject,
                newHtmlResult,
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
                    // "& > :not(style)": {
                    width: "100%",
                    direction: "rtl",
                    textAlign: "right",
                    paddingRight: "1.8vw",
                    paddingLeft: "1.8vw",
                    // },
                }}
                autoComplete="off"
                onSubmit={(event) => {
                    event.preventDefault();
                    handleSendEmailClick();
                }}
            >
                {/* <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                            paddingLeft: "1.8vw",
                            maxWidth: "calc(100% - 40px)", // Adjust the value as needed for margins
                            gap: 2, // Adjust the gap between elements as needed
                        }}
                    > */}
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
                {/* </Box> */}
                <RichTextEditorComponent />

                <Divider sx={{ mt: 5, mb: 2 }} />

                <Button type="submit">Save and display HTML</Button>
            </Box>
        </>
    );
}

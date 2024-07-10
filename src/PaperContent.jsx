import RichTextEditorComponent from "./utils/RichTextEditorComponent";
import GmailAuth, { handleSendEmailClick } from "./utils/GmailAuth";
import { Box, Button, Divider } from "@mui/material";
import MultiEmail from "./utils/MultipleEmailsInput";
import SendIcon from '@mui/icons-material/Send';
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import UpperBar from "./UpperBar";
import React from "react";

export default function PaperContent({
    setOpenSuccessEmail,
    setTextAlert,
    setStateAlert,
}) {
    // This comopnent stores all the components in the paper

    const [htmlResult, setHtmlResult] = useState("");
    const [emails, setEmails] = useState([]);
    const [subject, setSubject] = useState("");

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [tokenClient, setTokenClient] = useState(null);

    // This function handles the authentication and sending of the email on component mount
    useEffect(() => {
        // Ensure all required states are not empty or in their initial states
        if (emails.length > 0 && subject && htmlResult) {
            // Call the function to send the email
            GmailAuth({
                emails,
                subject,
                htmlResult,
                setOpenSuccessEmail,
                setIsSignedIn,
                setAccessToken,
                setTokenClient,
            });
        }
    }, [emails, subject, htmlResult, setOpenSuccessEmail]); // Dependency array

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        if (isButtonDisabled) {
            const timer = setTimeout(() => {
                setIsButtonDisabled(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isButtonDisabled]);

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
                    setIsButtonDisabled(true);
                    handleSendEmailClick({
                        emails,
                        subject,
                        htmlResult,
                        setOpenSuccessEmail,
                        isSignedIn,
                        accessToken,
                        tokenClient,
                        setTextAlert,
                        setStateAlert,
                    });
                }}
            >
                <MultiEmail emails={emails} setEmails={setEmails} />
                <TextField
                    className="mt-2 mb-3"
                    id="subject-textfield"
                    label="Subject"
                    variant="standard"
                    onChange={(e) => setSubject(e.target.value)}
                    fullWidth
                />
                <RichTextEditorComponent setHtmlResult={setHtmlResult} />

                <Divider sx={{ mt: 5, mb: 2 }} />

                <Button
                    variant="contained"
                    type="submit"
                    sx={{ direction: "rtl", textAlign: "right" }}
                    disabled={isButtonDisabled}
                >
                    שליחה
                    <SendIcon sx={{ marginRight: "10px", transform: "rotate(180deg)" }} />
                </Button>
            </Box>
        </>
    );
}

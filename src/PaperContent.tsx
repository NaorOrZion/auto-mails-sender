import RichTextEditorComponent from "./utils/RichTextEditorComponent";
import GmailAuth, { handleSendEmailClick } from "./utils/GmailAuth";
import { Box, Button, Divider } from "@mui/material";
import MultiEmail from "./utils/MultipleEmailsInput";
import SendIcon from '@mui/icons-material/Send';
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import UpperBar from "./UpperBar";

interface PaperContentProps {
    setOpenSuccessEmail: React.Dispatch<React.SetStateAction<boolean>>;
    setTextAlert: React.Dispatch<React.SetStateAction<string>>;
    setStateAlert: React.Dispatch<React.SetStateAction<string>>;
    // Add other states and their setter functions as needed
}

export default function PaperContent({
    setOpenSuccessEmail,
    setTextAlert,
    setStateAlert,
}: PaperContentProps) {
    // This comopnent stores all the components in the paper

    const [htmlResult, setHtmlResult] = useState<string>("");
    const [emails, setEmails] = useState<string[]>([]);
    const [subject, setSubject] = useState<string>("");

    const [isSignedIn, setIsSignedIn] = useState<Boolean>(false);
    const [accessToken, setAccessToken] = useState<string>("");
    const [tokenClient, setTokenClient] =
        useState<google.accounts.oauth2.TokenClient | null>(null);

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

                <Button variant="contained" type="submit" sx={{ direction: "rtl" , textAlign: "right"}}>
                    שליחה
                    <SendIcon sx={{ marginRight: "10px", transform: "rotate(180deg)"}} />
                </Button>
            </Box>
        </>
    );
}

import RichTextEditorComponent from "./utils/RichTextEditorComponent";
import GmailAuth, { handleSendEmailClick } from "./utils/GmailAuth";
import { Box, Button, Divider } from "@mui/material";
import MultiEmail from "./utils/MultipleEmailsInput";
import TextField from "@mui/material/TextField";
import UpperBar from "./UpperBar";
import { useState, useEffect } from "react";

export default function PaperContent(
    { setOpenSuccessEmail }: { setOpenSuccessEmail: any },
) {
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

        if (emails.length === 0) {
            setTextAlert("למי לשלוח את ההודעה?");
            setStateAlert("error");
            setOpenSuccessEmail(true);
        } else if (!subject) {
            setTextAlert("ככה לשלוח בלי נושא?");
            setStateAlert("error");
            setOpenSuccessEmail(true);
        } else if (!htmlResult) {
            setTextAlert("למה לשלוח הודעה ריקה?");
            setStateAlert("error");
            setOpenSuccessEmail(true);
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
                    required
                />
                <RichTextEditorComponent setHtmlResult={setHtmlResult} />

                <Divider sx={{ mt: 5, mb: 2 }} />

                <Button type="submit">Save and display HTML</Button>
            </Box>
        </>
    );
}

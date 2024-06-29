import RichTextEditorComponent from "./utils/RichTextEditorComponent";
import { Box, Button, Divider } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { RichTextEditorRef } from "mui-tiptap";
import MultiEmail from "./utils/MultipleEmailsInput";
import sendEmail from "./utils/sendEmail";
import { gapi } from "gapi-script";
import UpperBar from "./UpperBar";

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

    useEffect(() => {
        const initClient = () => {
            gapi.client
                .init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: [
                        "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
                    ],
                    scope: SCOPES,
                })
                .then(() => {
                    const authInstance = gapi.auth2.getAuthInstance();
                    authInstance.isSignedIn.listen(setIsSignedIn);
                    setIsSignedIn(authInstance.isSignedIn.get());
                });
        };

        gapi.load("client:auth2", initClient);
    }, []);

    const handleSendEmailClick = async () => {
        const newHtmlResult = (await rteRef.current?.editor?.getHTML()) ?? "";
        await setHtmlResult(newHtmlResult);

        if (isSignedIn) {
            await sendEmail(emails.join(","), subject, newHtmlResult);
        } else {
            // If the user is not signed in, sign in and then send the email
            gapi.auth2
                .getAuthInstance()
                .signIn()
                .then(() => {
                    setIsSignedIn(true);
                    sendEmail(emails.join(","), subject, newHtmlResult);
                });
        }
    };

    return (
        <>
            <Box sx={{ flexGrow: 3 }}>
                {/* <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSendEmailClick();
                    }}
                > */}
                    <UpperBar />
                    <Box
                        component="form"
                        sx={{
                            "& > :not(style)": {
                                m: 1,
                                width: "95%",
                                direction: "rtl",
                                textAlign: "right",
                                marginRight: "50px",
                            },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Box
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
                        >
                            <MultiEmail emails={emails} setEmails={setEmails} />
                            <TextField
                                id="subject-textfield"
                                label="Subject"
                                variant="standard"
                                onChange={(e) => setSubject(e.target.value)}
                                inputProps={{ maxLength: 250 }}
                                fullWidth
                                required
                            />
                        </Box>
                        <RichTextEditorComponent rteRef={rteRef} />

                        <Divider sx={{ mt: 5, mb: 2 }} />

                        <Button type="submit" onClick={handleSendEmailClick}>Save and display HTML</Button>
                    </Box>
                {/* </form> */}
            </Box>
        </>
    );
}

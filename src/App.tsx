import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import PaperContent from "./PaperContent";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import React from "react";
import Info from "./Info";
import "./css/App.css";

function App() {
    // This is the main component of the app
    // It uses the MainSections component to display the main content

    // This is the theme of the app
    const theme = createTheme({
        direction: "rtl",
        typography: {
            fontFamily: "Rubik, Arial",
        },
    });

    const [openSuccessEmail, setOpenSuccessEmail] = React.useState(false);

    const handleClose = (event: React.SyntheticEvent | Event) => {
        setOpenSuccessEmail(false);
    };

    return (
        <>
            <ThemeProvider theme={theme}>
                <div
                    id="wrapper"
                    className="d-flex"
                    style={{ height: "100vh" }}
                >
                    <div
                        id="content-wrapper"
                        className="flex-grow-1 d-flex flex-column"
                        style={{ height: "100%" }}
                    >
                        <div
                            id="content"
                            style={{
                                height: "100%",
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}
                        >
                            {/* Page Heading */}
                            {/* <Info /> */}
                            {/* Begin Page Content */}
                            <div className="container-fluid row d-flex flex-column">
                                <Paper
                                    elevation={7}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        p: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "start",
                                    }}
                                >
                                    <PaperContent setOpenSuccessEmail={setOpenSuccessEmail} />
                                </Paper>
                            </div>
                        </div>
                        <Snackbar
                            open={openSuccessEmail}
                            autoHideDuration={6000}
                            onClose={handleClose}
                            sx={{ direction: "rtl" }}
                        >
                            <Alert
                                severity="success"
                                variant="filled"
                                sx={{ width: "100%", direction: "rtl"}}
                            >
                                {"המייל נשלח בהצלחה!"}
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
            </ThemeProvider>
        </>
    );
}

export default App;

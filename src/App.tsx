import { createTheme, ThemeProvider } from "@mui/material/styles";
import PaperContent from "./PaperContent";
import Paper from "@mui/material/Paper";
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
                            <Info />
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
                                    <PaperContent />
                                </Paper>
                            </div>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        </>
    );
}

export default App;

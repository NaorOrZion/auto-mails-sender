import { Stack } from "@mui/material";
import { useRef } from "react";
import UpperBar from "./UpperBar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import StarterKit from "@tiptap/starter-kit";
import {
    MenuButtonBold,
    MenuButtonItalic,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditor,
    type RichTextEditorRef,
} from "mui-tiptap";

export default function PaperContent() {
    // This comopnent stores all the components in the paper

    const rteRef = useRef<RichTextEditorRef>(null);

    return (
        <>
            <Box sx={{ flexGrow: 3 }}>
                <UpperBar />
                <div className="myprettyform">
                    <Box
                        component="form"
                        sx={{
                            "& > :not(style)": {
                                m: 1,
                                width: "95%",
                                direction: "rtl",
                                textAlign: "right",
                            },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="to-textfield"
                            label="To"
                            variant="standard"
                        />
                        <TextField
                            id="subject-textfield"
                            label="Subject"
                            variant="standard"
                        />
                        <RichTextEditor
                            ref={rteRef}
                            extensions={[StarterKit]} // Or any Tiptap extensions you wish!
                            content="<p>Hello world</p>" // Initial content for the editor
                            className="rich-text-editor"
                            // Optionally include `renderControls` for a menu-bar atop the editor:
                            renderControls={() => (
                                <MenuControlsContainer>
                                    <MenuSelectHeading />
                                    <MenuDivider />
                                    <MenuButtonBold />
                                    <MenuButtonItalic />
                                    {/* Add more controls of your choosing here */}
                                </MenuControlsContainer>
                            )}
                        />
                    </Box>
                </div>
            </Box>
        </>
    );
}

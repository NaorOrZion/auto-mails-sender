import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Code } from "@tiptap/extension-code";
import { CodeBlock } from "@tiptap/extension-code-block";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { HardBreak } from "@tiptap/extension-hard-break";
import { History } from "@tiptap/extension-history";
import { Italic } from "@tiptap/extension-italic";
import { ListItem } from "@tiptap/extension-list-item";
import { Link } from "@tiptap/extension-link";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { EditorOptions } from "@tiptap/core";
import { Strike } from "@tiptap/extension-strike";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { Text } from "@tiptap/extension-text";
import {
    HeadingWithAnchor,
    LinkBubbleMenu,
    LinkBubbleMenuHandler,
    MenuButtonAddTable,
    MenuButtonBlockquote,
    MenuButtonBold,
    MenuButtonBulletedList,
    MenuButtonCode,
    MenuButtonCodeBlock,
    MenuButtonEditLink,
    MenuButtonItalic,
    MenuButtonOrderedList,
    MenuButtonStrikethrough,
    MenuButtonSubscript,
    MenuButtonSuperscript,
    MenuButtonTaskList,
    MenuControlsContainer,
    MenuButtonAddImage,
    MenuDivider,
    MenuSelectHeading,
    ResizableImage,
    RichTextEditor,
    insertImages,
    TableBubbleMenu,
    TableImproved,
    type RichTextEditorRef,
} from "mui-tiptap";
import UpperBar from "./UpperBar";
import MultiEmail from "./utils/MultiEmail";
import { getAuthUrl, getTokenFromUrl, isTokenValid } from "./utils/Auth";
import { Box, Button, Divider } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useRef, useState, useCallback, useEffect } from "react";
import sendEmails from "./utils/SendEmail";

const exampleContent = "<p>מה תרצו לכתוב היום?</p>";

const CustomLinkExtension = Link.extend({
    inclusive: false,
});

const CustomSubscript = Subscript.extend({
    excludes: "superscript",
});

const CustomSuperscript = Superscript.extend({
    excludes: "subscript",
});

const extensions = [
    // We use some but not all of the extensions from
    // https://tiptap.dev/api/extensions/starter-kit, plus a few additional ones

    // Note that the Table extension must come before other nodes. See README
    TableImproved.configure({
        resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,

    BulletList,
    CodeBlock,
    Document,
    HardBreak,
    ListItem,
    OrderedList,
    Paragraph,
    CustomSubscript,
    CustomSuperscript,
    Text,

    // Blockquote must come after Bold, since we want the "Cmd+B" shortcut to
    // have lower precedence than the Blockquote "Cmd+Shift+B" shortcut. See
    // README
    Bold,
    Blockquote,

    Code,
    Italic,
    Strike,
    CustomLinkExtension.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: false,
    }),
    LinkBubbleMenuHandler,

    // Extensions
    Gapcursor,
    HeadingWithAnchor.configure({
        // People shouldn't typically need more than 3 levels of headings, so
        // keep a more minimal set (than the default 6) to keep things simpler
        // and less chaotic.
        levels: [1, 2, 3],
    }),

    ResizableImage,

    // When images are dragged, we want to show the "drop cursor" for where they'll
    // land
    Dropcursor,

    TaskList,
    TaskItem.configure({
        nested: true,
    }),

    // We use the regular `History` (undo/redo) extension when not using
    // collaborative editing
    History,
];

function fileListToImageFiles(fileList: FileList): File[] {
    return Array.from(fileList).filter((file) => {
        const mimeType = (file.type || "").toLowerCase();
        return mimeType.startsWith("image/");
    });
}

export default function PaperContent() {
    // This comopnent stores all the components in the paper

    const rteRef = useRef<RichTextEditorRef>(null);

    const [htmlResult, setHtmlResult] = useState<string>("");
    const [emails, setEmails] = useState<string[]>([]);
    const [subject, setSubject] = useState<string>("");
    const [token, setToken] = useState<string>("");

    const handleClick = () => {
        window.location.href = getAuthUrl();
        const newHtmlResult = rteRef.current?.editor?.getHTML() ?? "";
        setHtmlResult(newHtmlResult);
    };

    useEffect(() => {
        const tokenFromUrl = getTokenFromUrl();
        if (tokenFromUrl) {
            window.localStorage.setItem("google_token", tokenFromUrl);
            setToken(tokenFromUrl);
            window.location.hash = ""; // Clear the token from the URL
        } else {
            const storedToken = window.localStorage.getItem("google_token");
            if (storedToken && isTokenValid(storedToken)) {
                setToken(storedToken);
            } else {
                window.localStorage.removeItem("google_token");
            }
        }
    }, []);

    // This useEffect hook will run whenever the htmlResult, emails, or subject
    useEffect(() => {
        if (htmlResult && emails.length && subject) {
            // This check ensures handleSubmit is not called with an empty string
            // sendEmails(token, emails, subject, htmlResult);
        }
    }, [htmlResult, emails, subject]);

    // This function will handle the new image files
    const handleNewImageFiles = useCallback(
        (files: File[], insertPosition?: number): void => {
            if (!rteRef.current?.editor) {
                return;
            }

            // Convert the image files to attributes that can be used to insert
            const attributesForImageFiles = files.map((file) => ({
                src: URL.createObjectURL(file),
                alt: file.name,
            }));

            // Insert the images into the editor
            insertImages({
                images: attributesForImageFiles,
                editor: rteRef.current.editor,
                position: insertPosition,
            });
        },
        []
    );

    // This function will handle the drop event of any image
    const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> =
        useCallback(
            (view, event, _slice, _moved) => {
                if (!(event instanceof DragEvent) || !event.dataTransfer) {
                    return false;
                }

                const imageFiles = fileListToImageFiles(
                    event.dataTransfer.files
                );
                if (imageFiles.length > 0) {
                    const insertPosition = view.posAtCoords({
                        left: event.clientX,
                        top: event.clientY,
                    })?.pos;

                    handleNewImageFiles(imageFiles, insertPosition);
                    event.preventDefault();
                    return true;
                }

                return false;
            },
            [handleNewImageFiles]
        );

    const handlePaste: NonNullable<
        EditorOptions["editorProps"]["handlePaste"]
    > = useCallback(
        (_view, event, _slice) => {
            if (!event.clipboardData) {
                return false;
            }

            const pastedImageFiles = fileListToImageFiles(
                event.clipboardData.files
            );
            if (pastedImageFiles.length > 0) {
                handleNewImageFiles(pastedImageFiles);
                return true;
            }

            return false;
        },
        [handleNewImageFiles]
    );

    return (
        <>
            <Box sx={{ flexGrow: 3 }}>
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
                            fullWidth
                        />
                    </Box>
                    <RichTextEditor
                        ref={rteRef}
                        content={exampleContent}
                        extensions={extensions}
                        editorProps={{
                            handleDrop: handleDrop,
                            handlePaste: handlePaste,
                        }}
                        className="rich-text-editor"
                        renderControls={() => (
                            <MenuControlsContainer>
                                <MenuSelectHeading />

                                <MenuDivider />

                                <MenuButtonBold />
                                <MenuButtonItalic />
                                <MenuButtonStrikethrough />
                                <MenuButtonSubscript />
                                <MenuButtonSuperscript />

                                <MenuDivider />

                                <MenuButtonEditLink />

                                <MenuDivider />

                                <MenuButtonOrderedList />
                                <MenuButtonBulletedList />
                                <MenuButtonTaskList />

                                <MenuDivider />

                                <MenuButtonBlockquote />

                                <MenuDivider />

                                <MenuButtonCode />

                                <MenuButtonCodeBlock />

                                <MenuDivider />

                                <MenuButtonAddTable />

                                <MenuButtonAddImage
                                    onClick={() => {
                                        const fileInput =
                                            document.createElement("input");
                                        fileInput.type = "file";
                                        fileInput.accept = "image/*";
                                        fileInput.multiple = true;
                                        fileInput.onchange = (event) => {
                                            const files = (
                                                event.target as HTMLInputElement
                                            ).files;
                                            if (files) {
                                                handleNewImageFiles(
                                                    Array.from(files)
                                                );
                                            }
                                        };
                                        fileInput.click();
                                    }}
                                />
                            </MenuControlsContainer>
                        )}
                    >
                        {() => (
                            <>
                                <LinkBubbleMenu />
                                <TableBubbleMenu />
                            </>
                        )}
                    </RichTextEditor>

                    <Divider sx={{ mt: 5, mb: 2 }} />

                    {!token ? (
                        <Button
                            onClick={() => {
                                handleClick();
                            }}
                        >
                            Save and display HTML
                        </Button>
                    ) : (
                        <></>
                    )}
                </Box>
            </Box>
        </>
    );
}

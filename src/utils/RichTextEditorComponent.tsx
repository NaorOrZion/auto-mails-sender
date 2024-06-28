import {
    LinkBubbleMenu,
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
    RichTextEditor,
    insertImages,
    TableBubbleMenu,
    type RichTextEditorRef,
} from "mui-tiptap";
import React from "react";
import { EditorOptions } from "@tiptap/core";
import { extensions } from "./extensions";

export default function RichTextEditorComponent( { rteRef } : { rteRef: React.RefObject<RichTextEditorRef>}) {
    // This component is the Rich Text Editor that will be used in the paper
    // It uses the mui-tiptap library
    // The editor has a lot of features, including the ability to add images
    // and tables, and to format text in various ways
    const exampleContent = "<p>מה תרצו לכתוב היום?</p>";

    // This function will convert a FileList to an array of File objects
    function fileListToImageFiles(fileList: FileList): File[] {
        return Array.from(fileList).filter((file) => {
            const mimeType = (file.type || "").toLowerCase();
            return mimeType.startsWith("image/");
        });
    }

    // This function will handle the new image files
    const handleNewImageFiles = React.useCallback(
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
        React.useCallback(
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
    > = React.useCallback(
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
                                        handleNewImageFiles(Array.from(files));
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
        </>
    );
}

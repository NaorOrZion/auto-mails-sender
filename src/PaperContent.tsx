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
import { Placeholder } from "@tiptap/extension-placeholder";
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
import { Box, Button, Divider } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useRef, useState, useCallback } from "react";

const exampleContent =
  '<h2>Hey there 👋</h2><p>This is a <em>basic</em> example of using <a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev/">Tiptap</a> with <a target="_blank" rel="noopener noreferrer nofollow" href="https://mui.com/">MUI (Material-UI)</a>. Sure, there are all kind of <strong>basic text styles</strong> you’d probably expect from a text editor. But wait until you see the lists:</p><ul><li><p>That’s a bullet list with one …</p></li><li><p>… or two list items.</p></li></ul><p>Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try <code>inline code</code> and a code block:</p><pre><code class="language-css">body {\n  display: none;\n}</code></pre><p></p><p>It’s only the tip of the iceberg though. Give it a try and click a little bit around. And feel free to add and resize cat photos:</p><img height="auto" src="http://placekitten.com/g/500" alt="wat" width="257" style="aspect-ratio: 1 / 1"><p></p><p>Organize information in tables:</p><table><tbody><tr><th colspan="1" rowspan="1"><p>Name</p></th><th colspan="1" rowspan="1"><p>Role</p></th><th colspan="1" rowspan="1"><p>Team</p></th></tr><tr><td colspan="1" rowspan="1"><p>Alice</p></td><td colspan="1" rowspan="1"><p>PM</p></td><td colspan="1" rowspan="1"><p>Internal tools</p></td></tr><tr><td colspan="1" rowspan="1"><p>Bob</p></td><td colspan="1" rowspan="1"><p>Software</p></td><td colspan="1" rowspan="1"><p>Infrastructure</p></td></tr></tbody></table><p></p><p>Or write down your groceries:</p><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Milk</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Eggs</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Sriracha</p></div></li></ul><blockquote><p>Wow, that’s amazing. Good work, boy! 👏 <br>— Mom</p></blockquote><p>Give it a try!</p>';

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

  Placeholder.configure({
    placeholder: "מה תרצו לכתוב היום?",
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

  const [htmlResult, setHtmlResult] = useState("");

  const handleNewImageFiles = useCallback(
    (files: File[], insertPosition?: number): void => {
      if (!rteRef.current?.editor) {
        return;
      }

      const attributesForImageFiles = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }));

      insertImages({
        images: attributesForImageFiles,
        editor: rteRef.current.editor,
        position: insertPosition,
      });
    },
    []
  );

  const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> =
    useCallback(
      (view, event, _slice, _moved) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer) {
          return false;
        }

        const imageFiles = fileListToImageFiles(event.dataTransfer.files);
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

  const handlePaste: NonNullable<EditorOptions["editorProps"]["handlePaste"]> =
    useCallback(
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
            <TextField id="to-textfield" label="To" variant="standard" />
            <TextField
              id="subject-textfield"
              label="Subject"
              variant="standard"
            />
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
                      const fileInput = document.createElement("input");
                      fileInput.type = "file";
                      fileInput.accept = "image/*";
                      fileInput.multiple = true;
                      fileInput.onchange = (event) => {
                        const files = (event.target as HTMLInputElement).files;
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

            <Divider sx={{ mt: 5, mb: 2 }} />

            <Button
              onClick={() =>
                setHtmlResult(rteRef.current?.editor?.getHTML() ?? "")
              }
            >
              Save and display HTML
            </Button>
          </Box>
        </div>
      </Box>
    </>
  );
}

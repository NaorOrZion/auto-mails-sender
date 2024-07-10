import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { TextField, Chip, IconButton, Stack } from "@mui/material";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import customeThemeProps from "./CustomeThemeProps";
import translationProps from "./TranslationProps";
import React, { useState } from "react";
import fields from "./FieldsExcel";

// This component is a multiple email input field that allows users to add multiple emails
// It uses a TextField to input the email and a Chip to display the emails
// The emails are stored in the parent component's state
// The parent component should pass the emails and setEmails as props
// The emails should be an array of strings
const MultipleEmailsInput = ({
    emails,
    setEmails,
}) => {
    const [email, setEmail] = useState("");

    // Add the email to the emails array if it is a valid email
    const handleAddEmail = () => {
        // This condition checks if the email is not empty and if it is not already in the emails array
        if (email && !emails.includes(email)) {
            // This condition checks if the email is a valid email
            if (
                email
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )
            ) {
                // Add the email to the emails array and clear the input field
                setEmails([...emails, email]);
                setEmail("");
            }
        }
    };

    // Remove the email from the emails array
    const handleDeleteEmail = (emailToDelete) => () => {
        setEmails(emails.filter((email) => email !== emailToDelete));
    };

    function handleSubmit(data) {
        // Handle the submit event from the ReactSpreadsheetImport component
        // Add the valid emails to the emails array
        // The data object contains the following
        // all: an array of all the rows in the spreadsheet
        // invalidData: an array of the rows that are invalid
        // validData: an array of the rows that are valid
        const validRows = data.validData;

        // Add the valid emails to the emails array
        setEmails([...emails, ...validRows.map((row) => row.email)]);
    }

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    marginTop: 2,
                    marginLeft: 2,
                    flexWrap: "wrap",
                    overflowY: "auto",
                    maxHeight: 100,
                    width: "100%",
                    direction: "ltr",
                }}
            >
                {emails.map((email, index) => (
                    <Chip
                        key={index}
                        label={email}
                        onDelete={handleDeleteEmail(email)}
                        className="p-3 m-1 "
                        sx={{ direction: "rtl" }}
                    />
                ))}
            </Stack>
            <Stack
                id="emails-input-stack"
                direction="row"
                justifyContent="center"
                sx={{ width: "100%" }}
            >
                <ReactSpreadsheetImport
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSubmit={handleSubmit}
                    fields={fields}
                    translations={translationProps}
                    customTheme={customeThemeProps}
                    rowHook={(data, addError) => {
                        // This is a hook that will be called for each row in the spreadsheet.
                        // You can use it to validate the data in the row and add errors if needed.
                        // The data parameter is an object with the keys as the field keys and the values as the row values.
                        // The addError parameter is a function that you can use to add an error to the row.
                        // If you add an error, the row will be marked as invalid and the user will not be able to proceed to the next step.
                        // Validation
                        const dataEmail = data.email?.toString() ?? "";
                        const dataName = data.fullName?.toString() ?? "";

                        if (!dataEmail || !dataName) {
                            addError("name", {
                                message: "תא הפריט ריק!",
                                level: "error",
                            });
                        }

                        if (
                            !dataEmail
                                .toLowerCase()
                                .match(
                                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                )
                        ) {
                            addError("email", {
                                message: "המייל לא תקין",
                                level: "error",
                            });
                        }

                        return data;
                    }}
                />
                <IconButton
                    color="primary"
                    onClick={() => setIsOpen(true)}
                    sx={{ marginRight: "auto" }}
                >
                    <UploadFileRoundedIcon />
                </IconButton>
                <IconButton
                    color="primary"
                    onClick={handleAddEmail}
                    sx={{ marginRight: "auto" }}
                >
                    <AddCircleIcon />
                </IconButton>
                <TextField
                    id="emails-input"
                    label="To"
                    variant="standard"
                    value={email}
                    className="mt-2"
                    sx={{ direction: "ltr" }}
                    onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value.trim());
                        if (value.endsWith(" ") || value.endsWith(";")) {
                            handleAddEmail(); // Trim the email before adding
                            setEmail(""); // Clear the input field
                        }
                    }}
                    fullWidth
                />
            </Stack>
        </>
    );
};

export default MultipleEmailsInput;

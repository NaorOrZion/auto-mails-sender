const fields = [
    {
        // Visible in table header and when matching columns.
        label: "שם מלא",
        // This is the key used for this field when we call onSubmit.
        key: "fullName",
        // Allows for better automatic column matching. Optional.
        alternateMatches: ["שם", "שמות", "שמות מלאים", "שם חניך", "שם מלא"],
        // Used when editing and validating information.
        fieldType: {
            // There are 3 types - "input" / "checkbox" / "select".
            type: "input",
        },
        // Used in the first step to provide an example of what data is expected in this field. Optional.
        example: "ישראל ישראלי",
        // Can have multiple validations that are visible in Validation Step table.
        validations: [
            {
                // Can be "required" / "unique" / "regex"
                rule: "required",
                errorMessage: "יש להזין שם חניך",
                // There can be "info" / "warning" / "error" levels. Optional. Default "error".
                level: "error",
            },
        ],
    },
    {
        // Visible in table header and when matching columns.
        label: "מייל אזרחי",
        // This is the key used for this field when we call onSubmit.
        key: "email",
        // Allows for better automatic column matching. Optional.
        alternateMatches: ["אימייל", "מייל", "אימייל אזרחי"],
        // Used when editing and validating information.
        fieldType: {
            // There are 3 types - "input" / "checkbox" / "select".
            type: "input",
        },
        // Used in the first step to provide an example of what data is expected in this field. Optional.
        example: "israelisraeli@gmail.com",
        // Can have multiple validations that are visible in Validation Step table.
        validations: [
            {
                // Can be "required" / "unique" / "regex"
                rule: "required",
                errorMessage: "יש להזין מייל אזרחי",
                // There can be "info" / "warning" / "error" levels. Optional. Default "error".
                level: "error",
            },
            {
                // Can be "required" / "unique" / "regex"
                rule: "unique",
                errorMessage: "קיים מייל זהה בקובץ",
                // There can be "info" / "warning" / "error" levels. Optional. Default "error".
                level: "error",
            },
        ],
    },
];

export default fields;
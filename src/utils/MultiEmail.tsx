import React, { useState } from "react";
import {
  TextField,
  Chip,
  IconButton,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const MultipleEmailsInput = ({
  emails,
  setEmails,
}: {
  emails: string[];
  setEmails: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [email, setEmail] = useState("");

  const handleAddEmail = () => {
    if (email && !emails.includes(email)) {
      setEmails([...emails, email]);
      setEmail("");
    }
  };

  const handleDeleteEmail = (emailToDelete: string) => () => {
    setEmails(emails.filter((email) => email !== emailToDelete));
  };

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
        }}
      >
        {emails.map((email, index) => (
          <Chip
            key={index}
            label={email}
            onDelete={handleDeleteEmail(email)}
            className="p-3 m-1 "
            sx={{}}
          />
        ))}
      </Stack>
      <Stack
        id="emails-input-stack"
        direction="row"
        justifyContent="center"
        sx={{ width: "100%" }}
      >
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
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ flexGrow: 1 }}
        />
      </Stack>
    </>
  );
};

export default MultipleEmailsInput;

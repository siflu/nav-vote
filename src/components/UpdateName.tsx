import * as React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Box, TextField } from "@material-ui/core";
import { useState } from "react";

export default function UpdateName(props: any) {
  const { open, onAccept, wallet, name } = props;

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [errorKey, setErrorKey] = useState(false);
  const [errorValue, setErrorValue] = useState(false);

  const handleAccept = onAccept;

  return (
    <Box>
      <Typography>Name: {name}</Typography>
      <TextField
        id="key-input"
        label="Key"
        autoComplete="off"
        variant="filled"
        error={errorKey ? true : false}
        value={key}
        sx={{ mx: 0, mt: 2, width: "100%", minWidth: 300 }}
        onChange={(e) => {
          setKey(e.target.value.toLowerCase());
          if (wallet.IsValidDotNavKey(e.target.value.toLowerCase())) {
            setErrorKey(false);
          } else {
            setErrorKey(true);
          }
        }}
      />

      <TextField
        id="value-input"
        label="Value"
        autoComplete="off"
        variant="filled"
        error={errorValue ? true : false}
        value={value}
        sx={{ mx: 0, mt: 2, width: "100%", minWidth: 300 }}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />

      <Button
        autoFocus
        onClick={() => {
          if (!errorKey && !errorValue && key) {
            handleAccept(name, key, value);
          }
        }}
        sx={{ mx: 2, mb: 2, width: "auto", float: "right" }}
      >
        Ok
      </Button>
    </Box>
  );
}

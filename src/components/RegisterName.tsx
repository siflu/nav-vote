import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import ContentCopyIcon from "@material-ui/icons/ContentCopy";
import { Input, Paper, TextField } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function RegisterName(props: any) {
  const { open, onClose, onAccept, wallet } = props;

  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  const handleClose = onClose;

  const handleAccept = onAccept;

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Register a dotNav name
        </BootstrapDialogTitle>
        <DialogContent
          sx={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            id="name-input"
            label="Name"
            autoComplete="off"
            variant="filled"
            error={error ? true : false}
            value={name}
            sx={{ mx: 0, mt: 2, width: "100%", minWidth: 300 }}
            onChange={(e) => {
              setName(e.target.value.toLowerCase());
              if (wallet.IsValidDotNavName(e.target.value.toLowerCase())) {
                setError(false);
              } else {
                setError(true);
              }
            }}
          />

          <Typography
            sx={{
              textAlign: "right",
              color: (theme) => theme.palette.error.light,
            }}
          >
            {error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              if (!error && name) {
                handleAccept(name);
              }
            }}
            sx={{ mx: 2, mb: 2, width: "auto", float: "right" }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
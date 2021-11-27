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
import { Paper } from "@material-ui/core";
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

export default function ConfirmTx(props: any) {
  const { open, onClose, onOk, text } = props;

  const handleClose = onClose;

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
          Confirm Transaction
        </BootstrapDialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Do you confirm the following transaction?
          </Typography>
          <Paper
            sx={{
              mx: 2,
              mt: 3,
              mb: 1,
              p: 4,
              position: "relative",
              wordBreak: "break-word",
            }}
          >
            <Typography gutterBottom>{text}</Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onOk} sx={{ mx: 2, mb: 2 }}>
            Yes
          </Button>
          <Button autoFocus onClick={handleClose} sx={{ mx: 2, mb: 2 }}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

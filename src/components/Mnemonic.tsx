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

export default function Mnemonic(props: any) {
  const { open, onClose, mnemonic } = props;

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
          Backup Mnemonic
        </BootstrapDialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            The following mnemonic phrase will let you recreate the wallet.
            Please back it up and keep it in a safe place out of the access of
            others!
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
            <CopyToClipboard text={mnemonic}>
              <IconButton sx={{ position: "absolute", bottom: 2, right: 2 }}>
                <ContentCopyIcon />
              </IconButton>
            </CopyToClipboard>
            <Typography gutterBottom>{mnemonic}</Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} sx={{ mx: 2, mb: 2 }}>
            I did backup the mnemonic phrase
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

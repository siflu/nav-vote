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
import { Box, Input, Paper, Tab, Tabs, TextField } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";
import Receive from "./Receive";
import Send from "./Send";
import UpdateName from "./UpdateName";

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
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

export default function OpenName(props: any) {
  const { open, onClose, wallet, openedName, nameData, onUpdate } = props;

  const [tabValue, setTabValue] = React.useState(0);

  const handleClose = onClose;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  console.log(nameData);

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
          {openedName}
        </BootstrapDialogTitle>
        <DialogContent
          sx={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box>
            <Tabs
              value={tabValue}
              onChange={(a: any, b: any) => {
                handleChange(a, b);
              }}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Name"
            >
              <Tab label="Current Values" />
              <Tab label="Update" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              {Object.keys(nameData).map((el) => {
                return (
                  <Typography
                    sx={{ mb: 2, maxWidth: "300px", wordWrap: "break-word" }}
                    key={el}
                  >
                    Key: {el} Values: {nameData[el]}
                  </Typography>
                );
              })}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <UpdateName
                wallet={wallet}
                name={openedName}
                onAccept={onUpdate}
              />
            </TabPanel>
          </Box>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
}
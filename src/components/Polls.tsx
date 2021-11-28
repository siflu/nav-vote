import React, { useState, useEffect } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Typography,
} from "@material-ui/core";

import { ExpandMoreOutlined } from "@material-ui/icons";

import staking from "../assets/earn_staking.png";
import swap from "../assets/swap_xnav.png";
import nav from "../assets/NAV.png";
import xnav from "../assets/XNAV.png";
import Receive from "./Receive";
import MyUsername from "./MyUsername";
import CreatePoll from "./CreatePoll";
import ListPolls from "./ListPolls";
import ListOwnPolls from "./ListOwnPolls";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

function Polls(props: any): React.ReactElement {
  const { balances, history, syncProgress, pendingQueue, addresses, hideTitle, wallet, onSend, network } =
    props;

  const [hideWarning, setHideWarning] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const { height, width } = useWindowDimensions();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const filteredHistory = history.filter((el: any) => el.memos.out[0] != "" && el.memos.out[0] != "Change");


  const itemsCount = Math.floor((height - 390) / 70);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
    >
      {hideTitle ? (
        <></>
      ) : (
        <Typography
          sx={{
            m: 4,
            mb: 2,
            maxWidth: "100%",
            wordWrap: "break-word",
            textAlign: "center",
          }}
          variant={"h4"}
        >
          Create Poll
        </Typography>
      )}
      <CreatePoll wallet={wallet}
                   network={network}
                   onSend={onSend}
                   balance={balances}
                   addresses={addresses}></CreatePoll>

      <ListOwnPolls addresses={addresses}
                            balances={balances}
                            history={history}
                            syncProgress={syncProgress}
                            pendingQueue={pendingQueue}
                            wallet={wallet}
                            network={network}
                            onSend={onSend}></ListOwnPolls>

            <Pagination
              sx={{ mt: 2, mx: "auto" }}
              count={Math.ceil(filteredHistory.length / itemsCount)}
              variant="outlined"
              shape="rounded"
              onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                setPageNumber(value);
              }}
            />
    </Box>
  );
}

export default Polls;

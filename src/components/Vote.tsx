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

function Vote(props: any): React.ReactElement {
  const { balances, history, syncProgress, pendingQueue, addresses, wallet, onSend, network, hideTitle } =
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
      <ListPolls addresses={addresses}
                            balances={balances}
                            history={history}
                            syncProgress={syncProgress}
                            pendingQueue={pendingQueue}
                            wallet={wallet}
                            network={network}
                            onSend={onSend}></ListPolls>
    </Box>
  );
}

export default Vote;

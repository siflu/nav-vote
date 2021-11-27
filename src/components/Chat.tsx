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
import SendMessage from "./SendMessage";

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

function Chat(props: any): React.ReactElement {
  const { balances, history, syncProgress, pendingQueue, addresses, wallet, onSend, network } =
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
      <Box
        sx={{
          maxWidth: 800,
          width: "90%",
          bgcolor: "background.paper",
          boxShadow: 1,
          borderRadius: 1,
          p: 1,
          mt: 2,
          alignSelf: "center",
        }}
      >
          <MyUsername addresses={addresses}></MyUsername>
      </Box>
      <Box
        sx={{
          maxWidth: 800,
          width: "90%",
          bgcolor: "background.paper",
          boxShadow: 1,
          borderRadius: 1,
          mt: 2,
          alignSelf: "center",
        }}
      >
        <List
          sx={{
            maxWidth: 800,
            bgcolor: "background.paper",
            overflow: "scroll",
            flexGrow: 1,
          }}
        >
          {filteredHistory
            .slice((pageNumber - 1) * itemsCount, pageNumber * itemsCount)
            .map((el: any) => {
              return (
                <>
                  <ListItem
                    alignItems="flex-start"
                    key={el.id}
                    sx={{
                      paddingLeft: 4,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={el.type == "xnav" ? xnav : nav}
                        src={el.type == "xnav" ? xnav : nav}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            color: (theme) =>
                              el.amount > 0
                                ? theme.palette.success.light
                                : theme.palette.error.light,
                            fontSize: "14px",
                          }}
                        >
                            {el.memos.out[0]}
                        </Typography>
                      }
                    />
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            sx={{
                              paddingRight: 4,
                              textAlign: "right",
                              fontSize: "12px",
                            }}
                            color="text.secondary"
                            variant="body2"
                          >
                            {new Date(el.timestamp * 1000).toLocaleString()}{" "}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </>
              );
            })}
        </List>
      </Box>
      <Pagination
        sx={{ mt: 2, mx: "auto" }}
        count={Math.ceil(filteredHistory.length / itemsCount)}
        variant="outlined"
        shape="rounded"
        onChange={(event: React.ChangeEvent<unknown>, value: number) => {
          setPageNumber(value);
        }}
      />

      <SendMessage wallet={wallet}
                   network={network}
                   onSend={onSend}
                   balance={balances}></SendMessage>
    </Box>
  );
}

export default Chat;

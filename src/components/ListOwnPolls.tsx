import React, { useState, useEffect } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Stack,
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
import { border } from "@material-ui/system";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { copyFile } from "fs";

ChartJS.register(ArcElement, Tooltip, Legend);

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

function ListOwnPolls(props: any): React.ReactElement {
  const { balances, history, syncProgress, pendingQueue, addresses, hideTitle, wallet, onSend, network, utxoType, address } =
    props;

  const [hideWarning, setHideWarning] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');
  const [from, setFrom] = React.useState("xnav");
  const [errorDest, setErrorDest] = React.useState(false);

  const { height, width } = useWindowDimensions();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  let availableOptions: string[];

  const filteredHistory = history.filter((el: any) => {
    try {
      const poll = JSON.parse(el.memos.out[0]);
      return poll.isPollAnswer;
    }
    catch(e) {
      return false;
    }
  });

  const itemsCount = Math.floor((height - 390) / 70);

  const pollDictionary = new Map();
  

  filteredHistory
            .map((el: any) => {
                const pollAnswer = JSON.parse(el.memos.out[0]);

                if(pollDictionary.get(pollAnswer.title) === undefined) {
                    const optionMap = new Map();
                    optionMap.set(pollAnswer.answer, 1);
                    pollDictionary.set(pollAnswer.title, optionMap);
                } else {
                    if(pollDictionary.get(pollAnswer.title).get(pollAnswer.answer) === undefined) {
                        pollDictionary.get(pollAnswer.title).set(pollAnswer.answer, 1);
                    } else {
                        let currentAnswerScore = pollDictionary.get(pollAnswer.title).get(pollAnswer.answer);
                        currentAnswerScore = currentAnswerScore + 1;
                        pollDictionary.get(pollAnswer.title).set(pollAnswer.answer, currentAnswerScore);
                    }
                }
            })

console.log(pollDictionary)

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
          My Polls
        </Typography>
      )}

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
            overflow: "hidden",
            flexGrow: 1,
          }}
        >
          {
            [...pollDictionary].map(poll => {
              console.log(poll);
              console.log(poll[0])
              console.log(poll[1])
              return (
                <>
                  <ListItem
                    alignItems="flex-start"
                    key={poll[0]}
                    sx={{
                      paddingLeft: 4,
                    }}
                  >
                    <Box>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: "14px",
                          }}
                        >
                          {poll[0]}
                        </Typography>
                      }
                    />
                    </Box>
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
    </Box>
  );
}

export default ListOwnPolls;

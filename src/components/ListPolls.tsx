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

function ListPolls(props: any): React.ReactElement {
  const { balances, history, syncProgress, pendingQueue, addresses, hideTitle, wallet, onSend, network, utxoType, address } =
    props;

  const [hideWarning, setHideWarning] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [from, setFrom] = React.useState("xnav");
  const [errorDest, setErrorDest] = React.useState(false);
  const [selectedPoll, setSelectedPoll] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

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
      return poll.isPoll;
    }
    catch(e) {
      return false;
    }    
  });

  const polls = filteredHistory.map((el: any) => {
    return JSON.parse(el.memos.out[0]);
  });
  
  const itemsCount = Math.floor((height - 390) / 70);

  function handleSelectedOptionChange(event: any) {
    setSelectedOption(event.target.value);
  }

  function setAvailableOptions(options: string[]) {
    availableOptions = options;
  }

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
          Active Polls
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
          p: 4,
          alignSelf: "center",
        }}
      >
        <>
        <Typography
          sx={{
            mt: 4,
            mb: 2,
            maxWidth: "100%",
            wordWrap: "break-word",
            textAlign: "left",
          }}
          variant={"h5"}
        >
          Choose the poll that you want to vote on
        </Typography>

          <Select
            labelId="polls"
            id="polls"
            value={selectedPoll}
            onChange={(e) => setSelectedPoll(e.target.value)}
            fullWidth={true}
            input={<OutlinedInput label="Polls" />}
            displayEmpty
            sx={{
              mt: 0,
            }}
          >
            {
              polls.map(({ title }: any, index: string | number | undefined) => (
                <MenuItem key={index} value={index}>{title}</MenuItem>
              ))
            }
          </Select>
        
          {
            selectedPoll !== '' && (
              <>
                <Typography
                  sx={{
                    mt: 4,
                    mb: 2,
                    maxWidth: "100%",
                    wordWrap: "break-word",
                    textAlign: "left",
                  }}
                  variant={"h5"}
                >
                  Choose your preferred option
                </Typography>

                <Select
                  labelId="options"
                  id="options"
                  value={selectedOption}
                  onChange={handleSelectedOptionChange}
                  fullWidth={true}
                  input={<OutlinedInput label="Polls" />}
                  displayEmpty
                  sx={{
                    mt: 0,
                    width: "100%"
                  }}
                >
                  {polls[selectedPoll].options.split(";").map((option: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, index: string | number | undefined) => (
                    <MenuItem key={index} value={index}>{option}</MenuItem>
                  ))}
                </Select>

                <Box
                  sx={{
                    m: (theme) => theme.spacing(2, 4, 2, 2),
                  }}
                >
                  <Button
                    sx={{ width: "auto", float: "right" }}
                    onClick={async () => {
                      const fullSelectedPoll = polls[selectedPoll];
                      const fullSelectedOption = fullSelectedPoll.options.split(";")[selectedOption];

                      const pollAnswer = {
                        id: fullSelectedPoll.id,
                        title: fullSelectedPoll.title,
                        answer: fullSelectedOption,
                        createdBy: fullSelectedPoll.createdBy,
                        validUntil: fullSelectedPoll.validUntil,
                        isPollAnswer: true
                      }

                      console.log(fullSelectedPoll)
                      if (!errorDest && pollAnswer.createdBy) {
                        await onSend(
                            from,
                            pollAnswer.createdBy,
                            1,
                            JSON.stringify(pollAnswer),
                            utxoType,
                            address,
                            false
                        );
                      }
                    }}
                  >
                    Send
                  </Button>
                </Box>
              </>
            )
          }
          
        
        </>
          
      </Box>
    </Box>
  );
}

export default ListPolls;

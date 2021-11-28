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
  const { balances, history, syncProgress, pendingQueue, addresses, hideTitle, wallet, onSend, network } =
    props;

  const [hideWarning, setHideWarning] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
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

  const itemsCount = Math.floor((height - 390) / 70);

  function handleSelectedOptionChange(event: { target: { value: React.SetStateAction<string>; }; }) {
    console.log(`value: ${event.target.value}`);
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
          {filteredHistory
            .slice((pageNumber - 1) * itemsCount, pageNumber * itemsCount)
            .map((el: any) => {
              const poll = JSON.parse(el.memos.out[0]);
              const options = poll.options.split(';');
              setAvailableOptions(options);
              console.log(availableOptions);
              console.log(poll);
              return (
                <>
                  <ListItem
                    alignItems="flex-start"
                    key={el.id}
                    sx={{
                      paddingLeft: 4,
                      
                    }}
                  >
                  <Stack 
                    spacing={2}
                    sx={{
                      m: 4,
                      width: "100%"
                    }}>  
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            mt: 4,
                            mb: 2,
                            maxWidth: "100%",
                            width: "100%",
                            wordWrap: "break-word",
                            textAlign: "left",
                          }}
                          variant={"h5"}
                        >
                          {poll.title}
                        </Typography>
                      }
                    />
                    
                    <FormControl 
                    sx={{
                      mb: 2,
                      width: "100%",
                    }}>
                      <InputLabel id="poll-options"
                      sx={{
                        color: "text.primary",
                      }}>Select option</InputLabel>
                      
                      <Select
                        labelId={"poll-options"}
                        id="option"
                        value={selectedOption}
                        fullWidth={true}
                        input={<OutlinedInput label="Options" />}
                        onChange={handleSelectedOptionChange}
                        displayEmpty
                        sx={{
                          width: "100%"
                        }}
                      >
                        {
                          availableOptions.map(option => {
                            return (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            );
                        })}
                      </Select>
                      </FormControl>

                    </Stack>
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

export default ListPolls;

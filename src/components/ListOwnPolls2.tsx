import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

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

function ListOwnPolls2(props: any): React.ReactElement {
  const { balances, history, syncProgress, pendingQueue, addresses, hideTitle, wallet, onSend, network, utxoType, address } =
    props;

  const [selectedPoll, setSelectedPoll] = useState('');

  const filteredHistory = history.filter((el: any) => {
    try {
      const poll = JSON.parse(el.memos.out[0]);
      return poll.isPollAnswer;
    }
    catch(e) {
      return false;
    }
  });

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
            });

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
          mb: 2,
          pb: 4,
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
            Choose the poll that you want to view
          </Typography>

            {/* <Select
              labelId="polls"
              id="polls"
              value={selectedPoll}
              onChange={(e) => setSelectedPoll(e.target.value)}
              fullWidth={true}
              displayEmpty
              sx={{
                mt: 0,
              }}
            >
              {
                [...pollDictionary].map(({poll}:any, index: string | number | undefined) => {
                  
                  (
                  <MenuItem key={poll} value={index}>{index}</MenuItem>
                )
              })
              }
            </Select> */}
            {
                Object.keys([...pollDictionary]).map(key => {
                  console.log(pollDictionary.get(key))
                })
            }
        </>
      </Box>
      <Box sx={{
        m: 4
      }}>
        </Box>
    </Box>
  );
}

export default ListOwnPolls2;

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

function ListOwnPolls(props: any): React.ReactElement {
  const { history, hideTitle } =
    props;

  const [selectedPoll, setSelectedPoll] = useState('');

  const filteredHistory = history.filter((el: any) => {
    try {
      const poll = JSON.parse(el.memos.out[0]);
      return poll.isPollAnswer && poll.validVoters.includes(poll.votedBy);
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

  const pollTitles = Array.from(pollDictionary.keys());

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
            Choose the poll that you want to view
          </Typography>

            <Select
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
              pollTitles.map(pollTitle => {
                return (
                  <MenuItem key={pollTitle} value={pollTitle}>{pollTitle}</MenuItem>
                )
              })              
            }
            </Select>

            <List
              sx={{
                maxWidth: 800,
                bgcolor: "background.paper",
                overflow: "hidden",
                flexGrow: 1,
              }}
            >
              {
                Array.from([...pollDictionary].values()).filter(poll => poll[0] === selectedPoll).map(poll => {
                  const data = {
                    labels: [...poll[1]].map(option => { return(option[0]); }),
                    datasets: [
                      {
                        label: '# of Votes',
                        data: [...poll[1]].map(option => { return(option[1]); }),
                        backgroundColor: [
                          'rgba(10, 135, 245, .8)',
                          'rgba(114, 81, 214, .8)',
                          'rgba(220, 30, 185, .8)',
                          'rgba(240, 240, 240, .8)',
                          'rgba(251, 153, 2, .8)',
                          'rgba(254, 39, 18, 0.8)',
                        ],
                        borderColor: [
                          'rgba(10, 135, 245, .8)',
                          'rgba(114, 81, 214, .8)',
                          'rgba(220, 30, 185, .8)',
                          'rgba(220, 220, 220, .8)',
                          'rgba(251, 153, 2, .8)',
                          'rgba(254, 39, 18, 0.8)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  };

                  return (
                    <>
                      <ListItem
                        alignItems="flex-start"
                        key={poll[0]}
                        sx={{
                          paddingLeft: 4,
                          textAlign: "center"
                        }}
                      >
                        <Box sx={{
                          margin: "auto",
                          textAlign: "center"
                        }}>
                        <ListItemText
                          primary={
                            <React.Fragment>
                              <Typography
                                sx={{
                                  m: 4,
                                  mb: 3,
                                  wordWrap: "break-word",
                                  textAlign: "center",
                                }}
                                variant={"h5"}
                              >
                                {poll[0]}
                              </Typography>
                            </React.Fragment>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{
                                  paddingRight: 4,
                                  textAlign: "right",
                                  fontSize: "12px",
                                }}
                                color="text.primary"
                                variant="body2"
                              >
                                {
                                  [...poll[1]].map(option => {
                                   {option.key}
                                  })
                                }
                              </Typography>
                            </React.Fragment>
                          }
                        />
                        <Pie  
                          key={poll[0].key}
                          data={data} />
                        </Box>
                  </ListItem>
                    </>
                  );
                })
              }
            </List>
            
        </>
      </Box>
      <Box sx={{
        m: 4
      }}>
        </Box>
    </Box>
  );
}

export default ListOwnPolls;

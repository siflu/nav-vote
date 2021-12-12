import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@material-ui/core";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PollAnswer } from "../models/PollAnswer";

ChartJS.register(ArcElement, Tooltip, Legend);

function ListOwnPolls(props: any): React.ReactElement {
  const { history, hideTitle, walletInstance } =
    props;

  const [selectedPoll, setSelectedPoll] = useState('');
  const [myPolls, setMyPolls] = useState(new Map<string, string>());
  const [pollDictionary, setPollDictionary] = useState(new Map<string, PollAnswer>());

  const updateMyPolls = (k: string,v: string) => {
    setMyPolls(new Map(myPolls.set(k,v)));
  }

  const filteredHistory = history.filter((el: any) => {
    try {
      const poll = JSON.parse(el.memos.out[0]);
      return poll.isPollAnswer && poll.version === "v1.0";
    }
    catch(e) {
      return false;
    }
  });

  async function buildPollDictionary(): Promise<Map<string, PollAnswer>> {
    const pollDictionary2 = new Map<string, PollAnswer>();

    await Promise.all(
      filteredHistory
        .map(async (el: any) => {
          const pollAnswer = JSON.parse(el.memos.out[0]);
          const infosOfPoll = await walletInstance.db.GetValue(pollAnswer.id);

          if(infosOfPoll !== undefined) {
            const validVoters = infosOfPoll.get("validVoters");
            const validOptions = infosOfPoll.get("validOptions");

            // only count vote if it was sent by a valid voter and contains a valid option
            if(infosOfPoll !== undefined && validVoters.includes(pollAnswer.votedBy) && validOptions.includes(pollAnswer.answer)) {
                if(pollDictionary2.get(pollAnswer.id) === undefined) {
                  const pa = new PollAnswer();
                  pa.title = pollAnswer.title;
                  pa.optionsWithCount.set(pollAnswer.answer, 1);
                  pollDictionary2.set(pollAnswer.id, pa);
                  updateMyPolls(pollAnswer.id, pollAnswer.title);
                } 
                else {
                  if(pollDictionary2.get(pollAnswer.id)?.optionsWithCount.get(pollAnswer.answer) === undefined) {
                    pollDictionary2.get(pollAnswer.id)?.optionsWithCount.set(pollAnswer.answer, 1);
                  } else {
                    let currentAnswerScore = pollDictionary2.get(pollAnswer.id)?.optionsWithCount.get(pollAnswer.answer) ?? 0;
                    currentAnswerScore = currentAnswerScore + 1;
                    pollDictionary2.get(pollAnswer.id)?.optionsWithCount.set(pollAnswer.answer, currentAnswerScore);
                  }
                }
              }
            }
      }));
      
      return pollDictionary2;
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
              onOpen={async () => {
                const pd = await buildPollDictionary();
                setPollDictionary(pd);
              }}
              onChange={(e) => {
                setSelectedPoll(e.target.value)
              }
              }
              fullWidth={true}
              displayEmpty
              sx={{
                mt: 0,
              }}
            >
            {
             [...myPolls.keys()].map((k: string) => {
               return (
                <MenuItem key={k} value={k}>{myPolls.get(k)}</MenuItem>
               )
             }
            )
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
                  [...pollDictionary].filter(x => x[0] === selectedPoll).map(poll => { 
                  const data = {
                    labels: [...poll[1].optionsWithCount].map(optionsWithCount => { return(optionsWithCount[0]); }),
                    datasets: [
                      {
                        label: '# of Votes',
                        data: [...poll[1].optionsWithCount].map(optionsWithCount => { return(optionsWithCount[1]); }),
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
                          key={poll[0]}
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
                                {poll[1].title}
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
                                   [...poll[1].optionsWithCount].map(option => {
                                   {option[0]}
                                  })
                                }
                              </Typography>
                            </React.Fragment>
                          }
                        />

                        <Pie
                          key={poll[1].title}
                          data={data} />

                        <Button
                          sx={{mt: 4}}
                          onClick={async () => {
                            const pd = await buildPollDictionary();
                            setPollDictionary(pd);
                          }}
                          >
                          Refresh data 
                        </Button>
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

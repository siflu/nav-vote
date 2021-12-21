import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}


function ListPolls(props: any): React.ReactElement {
  const { history, hideTitle, onSend, utxoType, addresses, xNavAvailable, walletInstance, wallet } =
    props;

  const [from, setFrom] = React.useState("xnav");
  const [errorDest, setErrorDest] = React.useState(false);
  const [selectedPoll, setSelectedPoll] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

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
  
  function handleSelectedOptionChange(event: any) {
    setSelectedOption(event.target.value);
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
      { 
      xNavAvailable ? null :
        <Box 
          sx={{
            m: 4,
            bgcolor: "#ff0033",
            color: "#fff",
            boxShadow: 2,
            borderRadius: 2,
          }}>
            <Typography
              sx={{
                m: 4,
                mt: 2,
                mb: 2,
                maxWidth: "100%",
                wordWrap: "break-word",
                textAlign: "center",
              }}
              variant={"h5"}
            >
              You need at least 0.1 xNav to be able to vote
          </Typography>
        </Box>
    }

      {hideTitle ? (
        <></>
      ) : (
        <Typography
          sx={{
            m: 4,
            mt: 2,
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
            disabled={!xNavAvailable}
            onChange={(e) => setSelectedPoll(e.target.value)}
            fullWidth={true}
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
                  displayEmpty
                  sx={{
                    mt: 0,
                    width: "100%"
                  }}
                >
                  {polls[selectedPoll].options.map((option: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, index: string | number | undefined) => (
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
                      const fullSelectedOption = fullSelectedPoll.options[selectedOption];
                      const votingAddress = Object.entries(addresses["spending"]["private"]).filter((el: any) => {
                        return fullSelectedPoll.validVoters.includes(el[0]);
                      })[0][0]

                      const pollAnswer = {
                        id: fullSelectedPoll.id,
                        title: fullSelectedPoll.title,
                        answer: fullSelectedOption,
                        createdBy: fullSelectedPoll.createdBy,
                        validUntil: fullSelectedPoll.validUntil,
                        isPollAnswer: true,
                        votedBy: votingAddress,
                        version: "v1.0"
                      }

                      if (!errorDest && pollAnswer.createdBy) {
                        await onSend(
                            from,
                            pollAnswer.createdBy,
                            0 * 1e8,
                            JSON.stringify(pollAnswer),
                            utxoType,
                            undefined,
                            false,
                            `Do you really want to vote for ${pollAnswer.answer}?`
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

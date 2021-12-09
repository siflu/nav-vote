import React, { useState, useEffect } from "react";
import {
  Box,
  Pagination,
  Typography,
} from "@material-ui/core";

import CreatePoll from "./CreatePoll";
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
  const { balances, history, syncProgress, pendingQueue, addresses, hideTitle, wallet, onSend, onSendMultiple, network, walletInstance } =
    props;

  const [pageNumber, setPageNumber] = useState(1);
  const { height, width } = useWindowDimensions();
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
                   onSendMultiple={onSendMultiple}
                   balance={balances}
                   addresses={addresses}
                   walletInstance={walletInstance}></CreatePoll>

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

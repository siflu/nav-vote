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
  const { balances, history, syncProgress, pendingQueue, addresses, xNavAvailable, hideTitle, wallet, onSend, onSendMultiple, network, walletInstance } =
    props;

  const [pageNumber, setPageNumber] = useState(1);
  const { height, width } = useWindowDimensions();
  const filteredHistory = history.filter((el: any) => { 
    return el !== undefined && el.memos !== undefined && el.memos.out !== undefined && el.memos.out[0] != "" && el.memos.out[0] != "Change"});
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
      <CreatePoll wallet={wallet}
                   network={network}
                   onSendMultiple={onSendMultiple}
                   balance={balances}
                   addresses={addresses}
                   xNavAvailable={xNavAvailable}
                   walletInstance={walletInstance}
                   syncProgress={syncProgress}
                   pendingQueue={pendingQueue}></CreatePoll>

      <ListOwnPolls addresses={addresses}
                    xNavAvailable={xNavAvailable}
                    balances={balances}
                    history={history}
                    syncProgress={syncProgress}
                    pendingQueue={pendingQueue}
                    wallet={wallet}
                    walletInstance={walletInstance}
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

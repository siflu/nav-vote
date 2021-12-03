import React, { useState, useEffect } from "react";
import {
  Box,
} from "@material-ui/core";


import ListPolls from "./ListPolls";

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

function Vote(props: any): React.ReactElement {
  const { balances, history, syncProgress, pendingQueue, addresses, wallet, onSend, network, hideTitle, } =
    props;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
    >      
      <ListPolls addresses={addresses}
                            balances={balances}
                            history={history}
                            syncProgress={syncProgress}
                            pendingQueue={pendingQueue}
                            wallet={wallet}
                            network={network}
                            onSend={onSend}></ListPolls>
    </Box>
  );
}

export default Vote;

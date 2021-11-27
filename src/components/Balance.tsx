import React, { useState, useEffect } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Typography,
} from "@material-ui/core";

import { ExpandMoreOutlined } from "@material-ui/icons";

import staking from "../assets/earn_staking.png";
import swap from "../assets/swap_xnav.png";
import nav from "../assets/NAV.png";
import xnav from "../assets/XNAV.png";

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

function Balance(props: any): React.ReactElement {
  const { balances, history, syncProgress, pendingQueue, onSwap, onStake } =
    props;

  const [hideWarning, setHideWarning] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const { height, width } = useWindowDimensions();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  console.log(history);

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
      {syncProgress < 100 && syncProgress >= 0 ? (
        <>
          <Typography sx={{ width: "100", textAlign: "center", p: 2 }}>
            Synchronizing...{" "}
            {pendingQueue > 0 ? `${pendingQueue} transactions left.` : ""}
          </Typography>
          <LinearProgress
            variant={syncProgress == 0 ? "indeterminate" : "determinate"}
            value={syncProgress}
            sx={{ backgroundColor: "background.default" }}
          ></LinearProgress>
        </>
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
          Home
        </Typography>
      )}

      {syncProgress < 100 && syncProgress >= 0 && !hideWarning && (
        <Alert
          sx={{
            maxWidth: 400,
            alignSelf: "center",
            px: 4,
            mt: 2,
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
          severity={"warning"}
          onClick={() => {
            setHideWarning(true);
          }}
        >
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          The wallet is currently syncing, the balances won't be accurate.
          <Box sx={{ textAlign: "right", fontSize: 10 }}>
            Click to hide warning
          </Box>
        </Alert>
      )}
      <Box
        sx={{
          maxWidth: 800,
          width: "90%",
          bgcolor: "background.default",
          boxShadow: 2,
          borderRadius: 2,
          p: 1,
          mt: 2,
          alignSelf: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box sx={{ padding: 1 }}>
            <Box
              sx={{
                color: "text.primary",
                fontSize: 18,
                fontWeight: "medium",
                textAlign: "center",
              }}
            >
              {(
                (balances.nav.confirmed + balances.nav.pending) /
                1e8
              ).toLocaleString()}
            </Box>
            <Box
              sx={{
                color: "success.dark",
                fontSize: 12,
                verticalAlign: "sub",
              }}
            />
            <Box
              sx={{
                color: "text.primary",
                fontWeight: "medium",
                mx: 0.5,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Public NAV
            </Box>
          </Box>

          <Box sx={{ padding: 1 }}>
            <Box
              sx={{
                color: "text.primary",
                fontSize: 18,
                fontWeight: "medium",
                textAlign: "center",
              }}
            >
              {(
                (balances.xnav.confirmed + balances.xnav.pending) /
                1e8
              ).toLocaleString()}
            </Box>
            <Box
              sx={{
                color: "success.dark",
                fontSize: 12,
                verticalAlign: "sub",
              }}
            />
            <Box
              sx={{
                color: "text.primary",
                fontWeight: "medium",
                mx: 0.5,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Private xNAV
            </Box>
          </Box>

          <Box sx={{ padding: 1 }}>
            <Box
              sx={{
                color: "text.primary",
                fontSize: 18,
                fontWeight: "medium",
                textAlign: "center",
              }}
            >
              {(
                (balances.staked.confirmed + balances.staked.pending) /
                1e8
              ).toLocaleString()}
            </Box>
            <Box
              sx={{
                color: "success.dark",
                fontSize: 12,
                verticalAlign: "sub",
              }}
            />
            <Box
              sx={{
                color: "text.primary",
                fontWeight: "medium",
                mx: 0.5,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Staking NAV
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          maxWidth: 800,
          width: "90%",
          bgcolor: "background.default",
          boxShadow: 2,
          borderRadius: 2,
          mt: 2,
          alignSelf: "center",
        }}
      >
        <List
          sx={{
            maxWidth: 800,
            bgcolor: "background.default",
            overflow: "hidden",
            flexGrow: 1,
          }}
        >
          {history
            .slice((pageNumber - 1) * itemsCount, pageNumber * itemsCount)
            .map((el: any) => {
              return (
                <>
                  <ListItem
                    alignItems="flex-start"
                    key={el.id}
                    sx={{
                      paddingLeft: 4,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={el.type == "xnav" ? xnav : nav}
                        src={el.type == "xnav" ? xnav : nav}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            color: (theme) =>
                              el.amount > 0
                                ? theme.palette.success.light
                                : theme.palette.error.light,
                            fontSize: "14px",
                          }}
                        >
                          {" "}
                          {String(el.amount / 1e8) +
                            " " +
                            (el.type == "xnav" ? "xNAV" : "NAV")}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline", fontSize: "12px" }}
                            variant="body2"
                            color="text.primary"
                          >
                            {el.type == "nav"
                              ? "NAV"
                              : el.type == "xnav"
                              ? "xNAV"
                              : "Staking"}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <ListItemText
                      primary={
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
                            {new Date(el.timestamp * 1000).toLocaleString()}{" "}
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
                            {el.confirmed ? "Confirmed" : "Pending"}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </>
              );
            })}
        </List>
      </Box>
      <Pagination
        sx={{ mt: 2, mx: "auto" }}
        count={Math.ceil(history.length / itemsCount)}
        variant="outlined"
        shape="rounded"
        onChange={(event: React.ChangeEvent<unknown>, value: number) => {
          setPageNumber(value);
        }}
      />

      <Box sx={{}}></Box>
    </Box>
  );
}

export default Balance;

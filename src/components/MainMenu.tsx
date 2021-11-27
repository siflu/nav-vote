import * as React from "react";
import logo from "../logo.svg";

import {
  Box,
  Button,
  CardContent,
  CardHeader,
  IconButton,
  CssBaseline,
  Typography,
  Stack,
} from "@material-ui/core";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { TITLE } from "../constants";
import ImportWallet from "./MainMenu/ImportWallet";
import CreateWallet from "./MainMenu/CreateWallet";
import OpenWallet from "./MainMenu/OpenWallet";
import Wrapper from "./Wrapper";

function MainMenu(props: any) {
  const { wallets, children, onLoad } = props;
  const [title, setTitle] = React.useState(TITLE);
  const [option, setOption] = React.useState(0);

  return (
    <React.Fragment>
      <CssBaseline />
      <Wrapper>
        <CardHeader
          title={
            <Typography
              sx={
                option == 0
                  ? {
                      marginTop: "10px",
                      textAlign: "center",
                    }
                  : {
                      textAlign: "center",
                      paddingRight: "45px",
                    }
              }
              variant={option == 0 ? "h4" : "h6"}
            >
              {title}
            </Typography>
          }
          avatar={
            option != 0 ? (
              <IconButton
                aria-label="settings"
                onClick={() => {
                  setOption(0);
                  setTitle(TITLE);
                }}
                sx={{
                  alignSelf: "end",
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
            ) : (
              ""
            )
          }
        ></CardHeader>
        <CardContent
          sx={{
            justifyContent: [null], //, 'center']
          }}
        >
          {option == 0 ? (
            <React.Fragment>
              <Box
                sx={{
                  width: "100%",
                  padding: (theme) => theme.spacing(0, 2, 2, 2),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={logo}
                  width={80}
                  style={{
                    paddingBottom: "50px",
                    paddingTop: "30px",
                  }}
                />
              </Box>

              <Stack spacing={2} mx={1} mb={2}>
                {wallets.length ? (
                  <Button
                    onClick={() => {
                      setOption(1);
                      setTitle("Open Wallet");
                    }}
                  >
                    Open a wallet
                  </Button>
                ) : (
                  ""
                )}

                <Button
                  onClick={() => {
                    setOption(2);
                    setTitle("Create Wallet");
                  }}
                >
                  Create a new wallet
                </Button>

                <Button
                  onClick={() => {
                    setOption(3);
                    setTitle("Import Wallet");
                  }}
                >
                  Import wallet
                </Button>
              </Stack>
            </React.Fragment>
          ) : option == 1 ? (
            <OpenWallet onClick={onLoad} wallets={wallets} />
          ) : option == 2 ? (
            <CreateWallet onClick={onLoad} wallets={wallets} />
          ) : option == 3 ? (
            <ImportWallet onClick={onLoad} wallets={wallets} />
          ) : (
            <>{children}</>
          )}
        </CardContent>
      </Wrapper>
    </React.Fragment>
  );
}

export default MainMenu;

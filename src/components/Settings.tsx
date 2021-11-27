import * as React from "react";

import {
  Button,
  CardContent,
  CardHeader,
  IconButton,
  CssBaseline,
  Typography,
  Stack,
  Divider,
  Box,
} from "@material-ui/core";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Wrapper from "./Wrapper";
import { ReactElement } from "react";

const TITLE = "Settings";

function Settings(props: any): ReactElement {
  const {
    children,
    onClose,
    onRemove,
    onMnemonic,
    walletName,
    network,
    blockHeight,
  } = props;
  const [title, setTitle] = React.useState(TITLE);
  const [option, setOption] = React.useState(0);

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
        }}
      >
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
          Settings
        </Typography>
        <Box
          sx={{
            maxWidth: 800,
            width: "90%",
            borderRadius: 1,
            mt: 2,
            alignSelf: "center",
            padding: 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {option == 0 ? (
            <React.Fragment>
              <Stack
                spacing={2}
                mx={1}
                mb={2}
                sx={{ maxWidth: 300, margin: "auto" }}
              >
                <Typography
                  sx={{ textAlign: "center", fontWeight: 400 }}
                  variant={"body1"}
                >
                  Wallet name:
                </Typography>
                <Typography
                  sx={{ textAlign: "center", fontWeight: 10 }}
                  variant={"body2"}
                >
                  {walletName}
                </Typography>
                <Typography
                  sx={{ textAlign: "center", fontWeight: 400 }}
                  variant={"body1"}
                >
                  Network:
                </Typography>
                <Typography
                  sx={{ textAlign: "center", fontWeight: 10 }}
                  variant={"body2"}
                >
                  {network}
                </Typography>
                <Typography
                  sx={{ textAlign: "center", fontWeight: 400 }}
                  variant={"body1"}
                >
                  Block height:
                </Typography>
                <Typography
                  sx={{ textAlign: "center", fontWeight: 10, pb: 2 }}
                  variant={"body2"}
                >
                  {blockHeight}
                </Typography>
                <Button onClick={onMnemonic}>View Mnemonic</Button>
                <Button onClick={onRemove}>Remove wallet</Button>
                <Button onClick={onClose}>Close wallet</Button>
              </Stack>
            </React.Fragment>
          ) : (
            <>{children}</>
          )}
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default Settings;

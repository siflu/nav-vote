import React from "react";
import { Box, Button, Paper, Typography } from "@material-ui/core";

import QRCode from "qrcode.react";
import SplitButton from "./elements/SplitButton";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconButton from "@material-ui/core/IconButton";
import ContentCopyIcon from "@material-ui/icons/ContentCopy";

function Receive(props: any): React.ReactElement {
  const { addresses, hideTitle } = props;
  const [addressType, setAddressType] = React.useState("public");
  if (!addresses["spending"]) return <Typography>Loading</Typography>;
  let address = Object.keys(addresses["spending"][addressType])[0];
  if (!address) return <Typography>Loading</Typography>;
  for (const i in addresses["spending"][addressType]) {
    if (!addresses["spending"][addressType][i].used) {
      address = i;
      break;
    }
  }

  const addressTypes: string[] = [];
  const addressOptions: string[] = [];

  if (addresses.spending.public) {
    addressTypes.push("public");
    addressOptions.push("Public NAV");
  }

  if (addresses.spending.private) {
    addressTypes.push("private");
    addressOptions.push("Private xNAV");
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
          Receiving Address
        </Typography>
      )}
      <Box
        sx={{
          maxWidth: "90%",
          width: "800",
          borderRadius: 1,
          mt: 2,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            alignSelf: "center",
            margin: "auto",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {addressTypes.length > 1 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Box sx={{ mx: 4, width: 250 }}>
                <SplitButton
                  onChange={(index: number) => {
                    setAddressType(addressTypes[index]);
                  }}
                  options={addressOptions}
                  width={250}
                ></SplitButton>
              </Box>
            </Box>
          ) : (
            <></>
          )}

          <QRCode
            value={address}
            title={address}
            style={{
              width: 250,
              height: 250,
            }}
          ></QRCode>

          <Paper
            sx={{
              mx: 3,
              mt: 2,
              mb: 1,
              p: 2,
              position: "relative",
              wordBreak: "break-word",
              width: 250,
            }}
          >
            <CopyToClipboard text={address}>
              <IconButton sx={{ position: "absolute", bottom: 2, right: 2 }}>
                <ContentCopyIcon />
              </IconButton>
            </CopyToClipboard>
            <Typography gutterBottom>{address}</Typography>
          </Paper>
        </Box>
      </Box>

      <Box sx={{}}></Box>
    </Box>
  );
}

export default Receive;

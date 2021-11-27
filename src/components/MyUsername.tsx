import React from "react";
import { Box, Button, Paper, Typography } from "@material-ui/core";

import QRCode from "qrcode.react";
import SplitButton from "./elements/SplitButton";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconButton from "@material-ui/core/IconButton";
import ContentCopyIcon from "@material-ui/icons/ContentCopy";

function MyUsername(props: any): React.ReactElement {
  const { addresses, hideTitle } = props;
  const [addressType, setAddressType] = React.useState("private");
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


        <Typography
          sx={{
            m: 0,
            mb: 0,
            maxWidth: "100%",
            wordWrap: "break-word",
            textAlign: "center",
          }}
        >
          Your username is: {address}
        </Typography>
  );
}

export default MyUsername;

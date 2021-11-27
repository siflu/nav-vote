import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  FormControl,
} from "@material-ui/core";
import React from "react";

import SplitButton from "./elements/SplitButton";

export default function SendMessage(props: any): React.ReactElement {
  const {
    addresses,
    balance,
    onSend,
    wallet,
    network,
    destination,
    utxoType,
    address,
    hideTitle,
    hideTo,
    hideFrom,
  } = props;

  const [from, setFrom] = React.useState("xnav");
  if (!balance || !balance[from]) return <>Loading</>;
  const [available, setAvailable] = React.useState(
    balance[from].confirmed / 1e8
  );
  const [to, setTo] = React.useState(destination);
  const [amount, setAmount] = React.useState<number | undefined>(0);
  const [errorDest, setErrorDest] = React.useState(false);
  const [message, setMessage] = React.useState("");

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
    >

      <Box
        sx={{
          maxWidth: 800,
          width: "90%",
          borderRadius: 1,
          mt: 2,

          p: 2,
          pt: 4,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            m: (theme) => theme.spacing(0, 1, 1, 1),
          }}
        >
          <Stack spacing={2}>

            {hideTo ? (
              <></>
            ) : (
              <>
                <TextField
                  autoComplete="off"
                  id="destination"
                  label="Destination"
                  value={to}
                  placeholder="The username we want to write to"
                  fullWidth
                  error={errorDest}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    if (wallet.bitcore.Address.isValid(e.target.value)) {
                      setTo(e.target.value);
                      setErrorDest(false);
                    } else {
                      console.log(
                        wallet.bitcore.Address.getValidationError(
                          e.target.value
                        )
                      );
                      setErrorDest(true);
                    }
                  }}
                />
              </>
            )}

            <TextField
              autoComplete="off"
              id="amount"
              label="Amount"
              placeholder="The message to send"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </Stack>
        </Box>
        <Box
          sx={{
            m: (theme) => theme.spacing(2, 1, 1, 1),
          }}
        >
          <Button
            sx={{ width: "auto", float: "right" }}
            onClick={async () => {
                if (!errorDest && to) {
                    await onSend(
                        from,
                        to,
                        1,
                        message,
                        utxoType,
                        address,
                        false
                    );
              }
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

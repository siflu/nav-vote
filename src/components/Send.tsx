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

export default function Send(props: any): React.ReactElement {
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

  const [from, setFrom] = React.useState(utxoType == 0x2 ? "staked" : "nav");
  if (!balance || !balance[from]) return <>Loading</>;
  const [available, setAvailable] = React.useState(
    balance[from].confirmed / 1e8
  );
  const [to, setTo] = React.useState(destination);
  const [amount, setAmount] = React.useState<number | undefined>(undefined);
  const [errorDest, setErrorDest] = React.useState(false);
  const [errorAmount, setErrorAmount] = React.useState(false);

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
          Send
        </Typography>
      )}
      <Box
        sx={{
          maxWidth: 800,
          width: "90%",
          boxShadow: 2,
          borderRadius: 2,
          mt: 2,
          p: 2,
          pt: 4,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            m: (theme) => theme.spacing(0, 1, 1, 1),
          }}
        >
          <Stack spacing={2}>
            {hideFrom ? (
              <></>
            ) : (
              <FormControl>
                <InputLabel id="network-label"
                sx={{
                  color: "text.primary",
                }}>From</InputLabel>

                <Select
                  labelId={"network-label"}
                  id="network"
                  value={from}
                  fullWidth
                  input={<OutlinedInput label="From" />}
                  onChange={(e) => {
                    if (e.target.value == "nav") {
                      if (amount == balance.xnav.confirmed / 1e8)
                        setAmount(balance.nav.confirmed / 1e8);
                      setAvailable(balance.nav.confirmed / 1e8);
                    } else if (e.target.value == "xnav") {
                      if (amount == balance.nav.confirmed / 1e8)
                        setAmount(balance.xnav.confirmed / 1e8);
                      setAvailable(balance.xnav.confirmed / 1e8);
                    }
                    setFrom(e.target.value);
                  }}
                  displayEmpty
                >
                  <MenuItem key="nav" value="nav">
                    NAV ({balance.nav.confirmed / 1e8} available)
                  </MenuItem>
                  <MenuItem key="xnav" value="xnav">
                    xNAV ({balance.xnav.confirmed / 1e8} available)
                  </MenuItem>
                </Select>
              </FormControl>
            )}

            {hideTo ? (
              <></>
            ) : (
              <>
                <TextField
                  autoComplete="off"
                  id="destination"
                  label="Destination"
                  value={to}
                  placeholder="The address to send the coins to"
                  fullWidth
                  error={errorDest}
                  InputLabelProps={{
                    style: { color: "#303030" },
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
                  placeholder="The amount to send"
                  fullWidth
                  error={errorAmount}
                  InputLabelProps={{
                    style: { color: "#303030" },
                    shrink: true,
                  }}
                  value={amount}
                  onChange={(e) => {
                      const am = parseFloat(e.target.value);
                      if (am >= 0 && am <= available) {
                          setAmount(am);
                          setErrorAmount(false);
                      } else {
                          setErrorAmount(true);
                      }
                  }}
                  InputProps={{
                    style: { color: "#303030" },
                      endAdornment: (
                          <InputAdornment position="end">
                              <Typography
                                  onClick={() => {
                                      setAmount(available);
                                  }}
                                  sx={{
                                    color: "text.primary"
                                  }}
                              >
                                  MAX
                              </Typography>
                          </InputAdornment>
                      ),
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
              if (!errorDest && !errorAmount && to && amount) {
                await onSend(
                  from || "nav",
                  to,
                  amount * 1e8,
                  "",
                  utxoType,
                  address
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

import * as React from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { CheckBox } from "@material-ui/icons";

class OpenWallet extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      ...props,
      name: "",
      errorName: false,
      password: undefined,
      spendingPassword: undefined,
      zap: false,
    };
  }

  public render() {
    const {
      wallets,
      name,
      errorName,
      onClick,
      password,
      spendingPassword,
      zap,
    } = this.state;

    return (
      <React.Fragment>
        <Box
          sx={{
            m: (theme) => theme.spacing(0, 1, 0, 1),
          }}
        >
          <Stack spacing={2}>
            <Select
              id="name"
              value={name}
              fullWidth
              onChange={(e) => {
                if (wallets.indexOf(e.target.value) >= 0) {
                  this.setState({ name: e.target.value, errorName: false });
                } else {
                  this.setState({ errorName: true });
                }
              }}
              error={errorName}
            >
              {wallets.map((wallet: string) => {
                return (
                  <MenuItem key={wallet} value={wallet}>
                    {wallet}
                  </MenuItem>
                );
              })}
            </Select>

            <TextField
              id="password"
              label="Wallet password"
              placeholder="The password used to open the wallet"
              fullWidth
              type={"password"}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}
            />

            <FormControlLabel
              value="1"
              control={
                <Checkbox
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ zap: e.target.checked });
                  }}
                />
              }
              label="Resync Wallet"
              labelPlacement="end"
            />
          </Stack>
        </Box>
        <Box
          sx={{
            m: (theme) => theme.spacing(2, 1, 2, 1),
          }}
        >
          <Button
            sx={{ width: "auto", float: "right" }}
            onClick={() => {
              if (!errorName && name) {
                onClick(name, undefined, undefined, password, undefined, zap);
              }
              if (!name) this.setState({ errorName: true });
            }}
          >
            Open
          </Button>
        </Box>
      </React.Fragment>
    );
  }
}

export default OpenWallet;

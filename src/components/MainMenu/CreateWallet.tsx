import * as React from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Select,
  MenuItem,
  Divider,
} from "@material-ui/core";

class CreateWallet extends React.Component<any, any> {
  public networks = [
    ["mainnet", "Mainnet"],
    ["testnet", "Testnet"],
  ];

  constructor(props: any) {
    super(props);

    this.state = {
      ...props,
      name: "",
      errorName: false,
      password: undefined,
      spendingPassword: undefined,
      network: "mainnet",
    };
  }

  public getNetworkName(type: string) {
    for (const i in this.networks) {
      const el = this.networks[i];

      if (el[0] == type) return el[1];
    }

    return undefined;
  }

  public render() {
    const {
      wallets,
      name,
      errorName,
      onClick,
      password,
      spendingPassword,
      network,
    } = this.state;

    return (
      <React.Fragment>
        <Box
          sx={{
            m: (theme) => theme.spacing(0, 1, 1, 1),
          }}
        >
          <Stack spacing={2}>
            <TextField
              id="name"
              label="Name"
              placeholder="Wallet 1"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              error={errorName}
              onChange={(e) => {
                if (wallets.indexOf(e.target.value) < 0) {
                  this.setState({ name: e.target.value, errorName: false });
                } else {
                  this.setState({ errorName: true });
                }
              }}
            />

            <Divider light>Encryption settings (Recommended)</Divider>

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

            <TextField
              id="spendingPassword"
              label="Spending password"
              placeholder="The password used to send transactions"
              fullWidth
              type={"password"}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                this.setState({ spendingPassword: e.target.value });
              }}
            />

            <Divider light>Network</Divider>

            <Select
              id="network"
              value={network}
              fullWidth
              onChange={(e) => {
                this.setState({ network: e.target.value });
              }}
              error={!this.getNetworkName(network)}
              displayEmpty
              renderValue={(value: any) => {
                return <Typography>{this.getNetworkName(value)}</Typography>;
              }}
            >
              {this.networks.map((result) => {
                return (
                  <MenuItem key={result[0]} value={result[0]}>
                    {result[1]}
                  </MenuItem>
                );
              })}
            </Select>
          </Stack>
        </Box>
        <Box
          sx={{
            m: (theme) => theme.spacing(2, 1, 1, 1),
          }}
        >
          <Button
            sx={{ width: "auto", float: "right" }}
            onClick={() => {
              if (!errorName) {
                onClick(
                  name,
                  undefined,
                  undefined,
                  password,
                  spendingPassword,
                  false,
                  network
                );
              }
            }}
          >
            Create
          </Button>
        </Box>
      </React.Fragment>
    );
  }
}

export default CreateWallet;

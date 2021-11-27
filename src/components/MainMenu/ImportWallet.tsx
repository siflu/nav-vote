import * as React from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  InputLabel,
  FormControl,
  Collapse,
  Accordion,
  AccordionSummary,
  Stack,
  Divider,
} from "@material-ui/core";
import { MenuItem, Select } from "@material-ui/core";
import { TITLE } from "../../constants";
import { IsValidMnemonic } from "../../utils/Mnemonic";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class ImportWallet extends React.Component<any, any> {
  public walletTypes = [
    ["navcoin-js-v1", TITLE],
    ["navcash", "NavCash"],
    ["navcoin-core", "Navcoin Core"],
    ["next", "Next Wallet"],
    ["navpay", "NavPay"],
  ];

  public networks = [
    ["mainnet", "Mainnet"],
    ["testnet", "Testnet"],
  ];

  constructor(props: any) {
    super(props);

    this.state = {
      ...props,
      name: "",
      mnemonic: "",
      type: "none",
      errorMnemonic: false,
      errorName: false,
      password: undefined,
      spendingPassword: undefined,
      network: "mainnet",
    };
  }

  public getWalletName(type: string) {
    for (const i in this.walletTypes) {
      const el = this.walletTypes[i];

      if (el[0] == type) return el[1];
    }

    return undefined;
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
      mnemonic,
      type,
      errorMnemonic,
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

            <TextField
              id="mnemonic"
              label="Mnemonic"
              placeholder="scan nephew tissue abuse clutch present erase spoil leisure silent drink today"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              error={errorMnemonic}
              onChange={(e) => {
                if (IsValidMnemonic(e.target.value, type)) {
                  this.setState({
                    mnemonic: e.target.value,
                    errorMnemonic: false,
                  });
                } else {
                  this.setState({
                    mnemonic: e.target.value,
                    errorMnemonic: true,
                  });
                }
              }}
            />

            <Select
              id="type"
              value={type}
              fullWidth
              onChange={(e) => {
                this.setState({ type: e.target.value });
                if (IsValidMnemonic(mnemonic, e.target.value)) {
                  this.setState({ errorMnemonic: false });
                } else {
                  this.setState({ errorMnemonic: true });
                }
              }}
              error={!(this.getWalletName(type) || type == "none")}
              displayEmpty
              renderValue={(value: any) => {
                return (
                  <Typography>
                    {value == "none" ? "Wallet type" : value}
                  </Typography>
                );
              }}
            >
              {this.walletTypes.map((result) => {
                return (
                  <MenuItem key={result[0]} value={result[0]}>
                    {result[1]}
                  </MenuItem>
                );
              })}
            </Select>

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
              if (
                !errorMnemonic &&
                !errorName &&
                mnemonic &&
                this.getWalletName(type) &&
                type != "none"
              ) {
                onClick(
                  name,
                  mnemonic,
                  type,
                  password,
                  spendingPassword,
                  false,
                  network
                );
              } else {
                if (!mnemonic) {
                  this.setState({ errorMnemonic: true });
                }
              }
            }}
          >
            Import
          </Button>
        </Box>
      </React.Fragment>
    );
  }
}

export default ImportWallet;

import React from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import Container from "./components/Container";
import MainMenu from "./components/MainMenu";

import themeOptions from "./themes/Default";
import Error from "./components/Error";
import Loading from "./components/Loading";

import NAV_logo from "./assets/NAV.png";
import WNAV_logo from "./assets/WNAV.svg";

import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@material-ui/core";

import {
  AccountBalanceOutlined,
  DnsOutlined,
  MailOutlineOutlined,
  MoveToInboxOutlined,
  PaymentOutlined,
  PollOutlined,
  SettingsOutlined,
} from "@material-ui/icons";

import Balance from "./components/Balance";
import Settings from "./components/Settings";
import * as localforage from "localforage";
import Mnemonic from "./components/Mnemonic";
import AskPassword from "./components/AskPassword";
import xnav from "./assets/XNAV.png";
import nav from "./assets/NAV.png";
import Receive from "./components/Receive";
import Send from "./components/Send";
import ConfirmTx from "./components/ConfirmTx";
import Vote from "./components/Vote";
import Polls from "./components/Polls";
import DotNav from "./components/DotNav";
import OpenName from "./components/OpenName";
import RegisterName from "./components/RegisterName";

themeOptions.spacing(10);

interface IAppState {
  walletName: string;
  walletList: string[];
  loadingWallet: boolean;
  connectingWallet: boolean;
  errorLoad: string;
  bottomNavigation: any;
  balances: {
    nav: { confirmed: number; pending: number };
    xnav: { confirmed: number; pending: number };
    cold: { confirmed: number; pending: number };
  };
  history: IWalletHistory[];
  syncProgress: number;
  pendingQueue: number;
  addresses: any;
  utxos: any;
  mnemonic: string;
  showMnemonic: boolean;
  askPassword: boolean;
  afterPassword: any;
  errorPassword: string;
  confirmTxText: string;
  showConfirmTx: boolean;
  toSendTxs: string[];
  blockHeight: number;
  names: any[];
  showRegisterName: boolean;
  errorRegisterName: string;
  showOpenName: boolean;
  nameData: any;
  openedName: string;
  pollId: string;
  pollInformationsToSave: Map<string, any[]>;
}

interface IWalletHistory {
  wallettxid: string;
  amount: number;
  type: string;
  confirmed: boolean;
  height: number;
  pos: number;
  timestamp: number;
  memos: string[];
}

const INITIAL_STATE: IAppState = {
  walletName: "",
  walletList: [],
  loadingWallet: false,
  connectingWallet: false,
  errorLoad: "",
  bottomNavigation: 0,
  balances: {
    nav: { confirmed: 0, pending: 0 },
    xnav: { confirmed: 0, pending: 0 },
    cold: { confirmed: 0, pending: 0 },
  },
  history: [],
  syncProgress: -1,
  pendingQueue: -1,
  addresses: {},
  utxos: [],
  mnemonic: "",
  showMnemonic: false,
  askPassword: false,
  afterPassword: undefined,
  errorPassword: "",
  confirmTxText: "",
  showConfirmTx: false,
  toSendTxs: [],
  blockHeight: -1,
  names: [],
  showRegisterName: false,
  errorRegisterName: "",
  showOpenName: false,
  nameData: {},
  openedName: "",
  pollId: "",
  pollInformationsToSave: new Map<string, any[]>()
};

class App extends React.Component<any, any> {
  public state: IAppState;
  public njs: any;
  public wallet: any;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    };
    this.njs = props.njs;
  }

  public async componentDidMount() {
    await this.updateWalletList();

    const alreadyLoaded: string =
        (await localforage.getItem("walletName")) || "";

    if (alreadyLoaded != "") {
      await this.loadWallet(alreadyLoaded, "", "", "", "", false, undefined);
    }
  }

  public async updateWalletList() {
    const wallets = await this.njs.wallet.WalletFile.ListWallets();
    this.setState({ walletList: wallets });
  }

  public async loadWallet(
      name: string,
      mnemonic: string,
      type: string,
      password: string,
      spendingPassword: string,
      zap: boolean,
      network: string | undefined
  ) {
    try {
      this.wallet = new this.njs.wallet.WalletFile({
        file: name,
        mnemonic: mnemonic,
        type: type,
        password: password,
        spendingPassword: spendingPassword,
        zapwallettxes: zap,
        network: network,
        log: true,
        adapter: "websql",
      });

      this.setState({
        loadingWallet: true,
        errorLoad: undefined,
      });

      this.wallet.on("db_load_error", async (e: string) => {
        await localforage.setItem("walletName", "");
        this.setState({
          loadingWallet: false,
          walletName: undefined,
          errorLoad:
              "Could not load the database. You introduced a wrong password or the data is corrupted.",
        });
      });

      this.wallet.on("db_closed", async () => {
        await localforage.setItem("walletName", "");
        this.setState({
          loadingWallet: false,
          walletName: undefined,
        });
      });

      this.wallet.on("loaded", async () => {
        const history = await this.wallet.GetHistory();

        await localforage.setItem("walletName", name);

        this.setState({
          loadingWallet: false,
          errorLoad: undefined,
          balances: await this.wallet.GetBalance(),
          utxos: await this.wallet.GetUtxos(0xff),
          stakingAddresses: await this.wallet.GetStakingAddresses(),
          addresses: await this.wallet.GetAllAddresses(),
          history: history,
          walletName: name,
          names: await this.wallet.GetMyNames(),
        });

        await this.wallet.Connect();
      });

      this.wallet.on("new_staking_address", async (a: any, b: any) => {
        this.setState({
          stakingAddresses: await this.wallet.GetStakingAddresses(),
          addresses: await this.wallet.GetAllAddresses(),
        });
      });

      this.wallet.on(
          "sync_status",
          async (progress: number, pending: number) => {
            if (pending % 50 == 0) {
              const history: IWalletHistory[] = await this.wallet.GetHistory();

              this.setState({
                balances: await this.wallet.GetBalance(),
                history,
                utxos: await this.wallet.GetUtxos(0xff),
                addresses: await this.wallet.GetAllAddresses(),
              });
            }
            this.setState({ syncProgress: progress, pendingQueue: pending });
          }
      );

      this.wallet.on("sync_finished", async () => {
        const history: IWalletHistory[] = await this.wallet.GetHistory();

        this.setState({
          balances: await this.wallet.GetBalance(),
          history,
          utxos: await this.wallet.GetUtxos(0xff),
          addresses: await this.wallet.GetAllAddresses(),
          names: await this.wallet.GetMyNames(),
        });
        this.setState({ syncProgress: 100, pendingQueue: 0 });
      });

      this.wallet.on("connected", (server: string) =>
          console.log(`connected to ${server}. waiting for sync`)
      );

      this.wallet.on("new_mnemonic", async (mnemonic: string) => {
        await this.updateWalletList();
        this.setState({ showMnemonic: true, mnemonic: mnemonic });
      });

      this.wallet.on("new_tx", async (entry: IWalletHistory) => {
        //console.log(entry);
      });

      this.wallet.on("new_block", (height: number) => {
        this.setState({ blockHeight: height });
      });

      this.wallet.on("new_name", async (name: string, height: number) => {
        this.setState({ names: await this.wallet.GetMyNames() });
      });

      this.wallet.on(
          "update_name",
          async (name: string, height: number, data: any) => {
            const { openedName } = this.state;

            if (name == openedName) {
              this.setState({ nameData: data });
            }
          }
      );

      await this.wallet.Load({ bootstrap: this.njs.wallet.xNavBootstrap });
    } catch (e) {
      console.log(e);
    }
  }
  

  public async onRemove(name?: string) {
    const { walletName } = this.state;
    this.wallet.Disconnect();
    this.njs.wallet.WalletFile.RemoveWallet(name || walletName);
    await localforage.setItem("walletName", "");
    await this.updateWalletList();
    this.setState({ bottomNavigation: 0, walletName: "" });
  }

  public async onClose() {
    this.wallet.Disconnect();
    this.wallet.CloseDb();
    await localforage.setItem("walletName", "");
    this.setState({ bottomNavigation: 0, walletName: "" });
  }

  public backToMainMenu() {
    this.setState({ errorLoad: undefined });
  }

  public async showMnemonic(password: string) {
    const mnemonic: string = await this.wallet.db.GetMasterKey(
        "mnemonic",
        password
    );

    if (mnemonic) {
      this.setState({
        showMnemonic: true,
        mnemonic,
        askPassword: false,
        afterPassword: undefined,
        errorPassword: "",
      });
    } else {
      this.setState({ errorPassword: "Wrong password!" });
    }
  }

  
  public onRegisterName = async (name: string) => {
    const afterFunc = async (password: string) => {
      const mnemonic: string = await this.wallet.db.GetMasterKey(
          "mnemonic",
          password
      );

      if (mnemonic) {
        this.setState({
          showRegisterName: false,
          askPassword: false,
          afterPassword: undefined,
          errorPassword: "",
        });
        await this.onRegisterNamePassword(name, password);
      } else {
        this.setState({ errorPassword: "Wrong password!" });
      }
    };
    
    if (await this.wallet.GetMasterKey("mnemonic", undefined)) {
      await afterFunc("");
    } else {
      this.setState({
        askPassword: true,
        afterPassword: afterFunc,
        errorPassword: "",
      });
    }
  };

  public onRegisterNamePassword = async (name: string, password = "") => {
    try {
      const txs = await this.wallet.RegisterName(name, password);
      if (txs) {
        this.setState({
          showConfirmTx: true,
          confirmTxText: `Register ${name} Fee: ${txs.fee / 1e8}`,
          toSendTxs: txs.tx,
        });
      } else {
        this.setState({
          errorLoad: "Could not create transaction.",
          showConfirmTx: false,
          confirmTxText: "",
          toSendTxs: [],
        });
      }
    } catch (e: any) {
      this.setState({
        errorLoad: e.toString(),
        showConfirmTx: false,
        confirmTxText: "",
        toSendTxs: [],
      });
    }
  };

  public onUpdateName = async (name: string, key: string, value: string) => {
    const afterFunc = async (password: string) => {
      const mnemonic: string = await this.wallet.db.GetMasterKey(
          "mnemonic",
          password
      );

      if (mnemonic) {
        this.setState({
          askPassword: false,
          afterPassword: undefined,
          errorPassword: "",
        });
        await this.onUpdateNamePassword(name, key, value, password);
      } else {
        this.setState({ errorPassword: "Wrong password!" });
      }
    };
    if (await this.wallet.GetMasterKey("mnemonic", undefined)) {
      await afterFunc("");
    } else {
      this.setState({
        askPassword: true,
        afterPassword: afterFunc,
        errorPassword: "",
      });
    }
  };

  public onUpdateNamePassword = async (
    name: string,
    key: string,
    value: string,
    password = ""
  ) => {
    try {
      const txs = await this.wallet.UpdateName(name, "", key, value, password);
      if (txs) {
        this.setState({
          showOpenName: false,
          showConfirmTx: true,
          confirmTxText: `Update ${name}: Set ${key} to ${value} - Fee: ${
              txs.fee / 1e8
          }`,
          toSendTxs: txs.tx,
        });
      } else {
        this.setState({
          errorLoad: "Could not create transaction.",
          showConfirmTx: false,
          confirmTxText: "",
          toSendTxs: [],
        });
      }
    } catch (e: any) {
      this.setState({
        errorLoad: e.toString(),
        showConfirmTx: false,
        confirmTxText: "",
        toSendTxs: [],
      });
    }
  };

  public onSend = async (
      from: string,
      to: string,
      amount: number,
      memo: string,
      type = 0x1,
      address = undefined,
      substractFee = true,
      confirmTxText = undefined
  ) => {
    const afterFunc = async (password: string) => {
      const mnemonic: string = await this.wallet.db.GetMasterKey(
          "mnemonic",
          password
      );

      if (mnemonic) {
        this.setState({
          askPassword: false,
          afterPassword: undefined,
          errorPassword: "",
        });
        await this.onSendPassword(from, to, amount, memo, password, type, address, substractFee, confirmTxText);
      } else {
        this.setState({ errorPassword: "Wrong password!" });
      }
    };
    if (await this.wallet.GetMasterKey("mnemonic", undefined)) {
      await afterFunc("");
    } else {
      this.setState({
        askPassword: true,
        afterPassword: afterFunc,
        errorPassword: "",
      });
    }
  };

  public onSendPassword = async (
      from: string,
      to: string,
      amount: number,
      memo = "",
      password = "",
      type = 0x1,
      address = undefined,
      substractFee = true,
      confirmTxText = undefined
  ) => {
    if (from == "nav" || from == "staked") {
      try {
        const txs = await this.wallet.NavCreateTransaction(
            to,
            amount,
            "",
            password,
            substractFee,
            100000,
            type,
            address
        );
        if (txs) {
            this.setState({
              showConfirmTx: true,
              confirmTxText: `${amount / 1e8} ${from} to ${to} Fee: ${
                  txs.fee / 1e8
              }`,
              toSendTxs: txs.tx,
            });
        }
        else {
          this.setState({
            errorLoad: "Could not create transaction.",
            showConfirmTx: false,
            confirmTxText: "",
            toSendTxs: [],
          });
        }
      } catch (e: any) {
        this.setState({
          errorLoad: e.toString(),
          showConfirmTx: false,
          confirmTxText: "",
          toSendTxs: [],
        });
      }
    } else if (from == "xnav") {
      try {
        const txs = await this.wallet.xNavCreateTransaction(
            to,
            amount,
            memo,
            password,
            substractFee
        );
        if (txs) {
          this.setState({
            showConfirmTx: true,
            confirmTxText: confirmTxText || `${amount / 1e8} ${from} to ${to} Fee: ${
                txs.fee / 1e8
            }`,
            toSendTxs: txs.tx,
          });
        } else {
          this.setState({
            errorLoad: "Could not create transaction.",
            showConfirmTx: false,
            confirmTxText: "",
            toSendTxs: [],
          });
        }
      } catch (e: any) {
        this.setState({
          errorLoad: e.toString(),
          showConfirmTx: false,
          confirmTxText: "",
          toSendTxs: [],
        });
      }
    }
  };

  public onSendMultiple = async (
    from: string,
    destinations: { dest: string; amount: number; memo: string; }[],
    subtractFee = true,
    confirmTxText = undefined,
    pollId = "",
    pollInformationsToSave = undefined
  ) => {
    const afterFunc = async (password: string) => {
      const mnemonic: string = await this.wallet.db.GetMasterKey(
          "mnemonic",
          password
      );

      if (mnemonic) {
        this.setState({
          askPassword: false,
          afterPassword: undefined,
          errorPassword: "",
        });
        await this.onSendPasswordMultiple(from, destinations, password, subtractFee, confirmTxText, pollId, pollInformationsToSave);
      } else {
        this.setState({ errorPassword: "Wrong password!" });
      }
    };
    if (await this.wallet.GetMasterKey("mnemonic", undefined)) {
      await afterFunc("");
    } else {
      this.setState({
        askPassword: true,
        afterPassword: afterFunc,
        errorPassword: "",
      });
    } 
  };
  
  public onSendPasswordMultiple = async (
    from: string,
    destinations: { dest: string; amount: number; memo: string; }[],
    password = "",
    subtractFee = true,
    confirmTxText = undefined,
    pollId = "",
    pollInformationsToSave = undefined
  ) => {
    if (from == "xnav") {
    try {
      const txs = await this.wallet.xNavCreateTransactionMultiple(
          destinations,
          password,
          subtractFee
      );
      if (txs) {
        this.setState({
          showConfirmTx: confirmTxText ? true : false,
          confirmTxText: confirmTxText || "",
          toSendTxs: txs.tx,
          pollId: pollId,
          pollInformationsToSave: pollInformationsToSave
        });
      } else {
        this.setState({
          errorLoad: "Could not create transaction.",
          showConfirmTx: false,
          confirmTxText: "",
          toSendTxs: [],
        });
      }
    } catch (e: any) {
      this.setState({
        errorLoad: e.toString(),
        showConfirmTx: false,
        confirmTxText: "",
        toSendTxs: [],
      });
    }
    }
  }

  public render = () => {
    const {
      walletName,
      walletList,
      loadingWallet,
      errorLoad,
      bottomNavigation,
      connectingWallet,
      balances,
      history,
      syncProgress,
      pendingQueue,
      showMnemonic,
      mnemonic,
      askPassword,
      afterPassword,
      errorPassword,
      addresses,
      confirmTxText,
      showConfirmTx,
      toSendTxs,
      blockHeight,
      names,
      showRegisterName,
      errorRegisterName,
      showOpenName,
      nameData,
      openedName,
    } = this.state;

    return (
        <ThemeProvider theme={themeOptions}>
          <CssBaseline />
          <Container>
            <Mnemonic
                open={showMnemonic}
                mnemonic={mnemonic}
                onClose={() => {
                  this.setState({ mnemonic: "", showMnemonic: false });
                }}
            />
            <ConfirmTx
                open={showConfirmTx}
                text={confirmTxText}
                onClose={() => {
                  this.setState({
                    confirmTxText: "",
                    showConfirmTx: false,
                    toSendTxs: [],
                  });
                }}
                onOk={() => {
                  try {
                    if(this.state.pollId && this.state.pollInformationsToSave.size > 0) {
                      this.wallet.db.SetValue(this.state.pollId, this.state.pollInformationsToSave);
                    }
                    this.wallet.SendTransaction(toSendTxs);
                  } catch (e: any) {
                    this.setState({
                      errorLoad: e.toString(),
                      showConfirmTx: false,
                      confirmTxText: "",
                      toSendTxs: [],
                    });
                  }
                  this.setState({
                    confirmTxText: "",
                    showConfirmTx: false,
                    toSendTxs: [],
                    //bottomNavigation: 4,
                  });
                }}
            />
            <AskPassword
                open={askPassword}
                onAccept={afterPassword}
                onClose={() => {
                  this.setState({
                    askPassword: false,
                    afterPassword: undefined,
                    errorPassword: "",
                  });
                }}
                error={errorPassword}
            />
            <RegisterName
                open={showRegisterName}
                onAccept={this.onRegisterName}
                onClose={() => {
                  this.setState({
                    showRegisterName: false,
                    errorRegisterName: "",
                  });
                }}
                wallet={this.wallet}
                error={errorRegisterName}
            />
            <OpenName
                open={showOpenName}
                openedName={openedName}
                nameData={nameData}
                onUpdate={this.onUpdateName}
                onClose={() => {
                  this.setState({
                    showOpenName: false,
                    openedName: "",
                    nameData: {},
                  });
                }}
                wallet={this.wallet}
            />
            {errorLoad ? (
                <Error
                    actions={[
                      {
                        text: "ok",
                        action: () => {
                          this.backToMainMenu();
                        },
                      },
                    ]}
                >
                  {errorLoad}
                </Error>
            ) : !walletName ? (
                <MainMenu
                    wallets={walletList}
                    onLoad={async (
                        name: string,
                        mnemonic: string,
                        type: string,
                        password: string,
                        spendingPassword: string,
                        zap: boolean,
                        network: string
                    ) => {
                      await this.loadWallet(
                          name,
                          mnemonic,
                          type,
                          password,
                          spendingPassword,
                          zap,
                          network
                      );
                    }}
                />
            ) : loadingWallet ? (
                <Loading>Loading wallet...</Loading>
            ) : connectingWallet ? (
                <Loading>Connecting to the network...</Loading>
            ) : (
                <>
                  {bottomNavigation == 0 ? (
                      <Balance
                          balances={balances}
                          history={history}
                          syncProgress={syncProgress}
                          pendingQueue={pendingQueue}
                      />
                  ) : bottomNavigation == 1 ? (
                      <Send
                          wallet={this.njs.wallet}
                          network={this.wallet.network}
                          balance={balances}
                          onSend={this.onSend}
                      />
                  ) : bottomNavigation == 2 ? (
                      <Receive addresses={addresses}></Receive>
                  ) : bottomNavigation == 3 ? (
                        <Polls
                            addresses={addresses}
                            balances={balances}
                            history={history}
                            syncProgress={syncProgress}
                            pendingQueue={pendingQueue}
                            wallet={this.njs.wallet}
                            walletInstance={this.wallet}
                            network={this.wallet.network}
                            onSend={this.onSend}
                            onSendMultiple={this.onSendMultiple}
                        />
                    ) : bottomNavigation == 4 ? (
                      <Vote
                          addresses={addresses}
                          balances={balances}
                          history={history}
                          syncProgress={syncProgress}
                          pendingQueue={pendingQueue}
                          wallet={this.njs.wallet}
                          network={this.wallet.network}
                          onSend={this.onSend}
                      />
                  ) : bottomNavigation == 5 ? (
                    <DotNav
                        names={names}
                        onRegisterName={() => {
                          this.setState({
                            showRegisterName: true,
                          });
                        }}
                        onOpenName={async (name: string) => {
                          const data = await this.wallet.ResolveName(name);
                          this.setState({
                            showOpenName: true,
                            openedName: name,
                            nameData: data,
                          });
                        }}
                        blockHeight={blockHeight}
                    />
                  ) : bottomNavigation == 6 ? (
                      <Settings
                          onClose={() => {
                            this.onClose();
                          }}
                          onRemove={() => {
                            this.onRemove();
                          }}
                          blockHeight={blockHeight}
                          onMnemonic={async () => {
                            const afterFunc = async (password: string) => {
                              await this.showMnemonic(password);
                            };
                            if (await this.wallet.GetMasterKey("mnemonic", undefined)) {
                              await afterFunc("");
                            } else {
                              this.setState({
                                askPassword: true,
                                afterPassword: afterFunc,
                                errorPassword: "",
                              });
                            }
                          }}
                          walletName={walletName}
                          network={this.wallet.network}
                      ></Settings>
                  ) 
                      : (
                          <>Unknown</>
                      )}
                  <Paper
                      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
                      elevation={10}
                  >
                    <BottomNavigation
                        showLabels
                        value={bottomNavigation}
                        onChange={(event, newValue) => {
                          this.setState({ bottomNavigation: newValue });
                        }}
                    >
                      <BottomNavigationAction
                          label="Home"
                          icon={<AccountBalanceOutlined />}
                      />
                      <BottomNavigationAction
                          label="Send"
                          icon={<PaymentOutlined />}
                      />
                      <BottomNavigationAction
                          label="Receive"
                          icon={<MoveToInboxOutlined />}
                      />
                      <BottomNavigationAction
                          label="Polls"
                          icon={<PollOutlined />}
                      />
                      <BottomNavigationAction
                          label="Vote"
                          icon={<MailOutlineOutlined />}
                      />
                      <BottomNavigationAction
                          label="DotNav"
                          icon={<DnsOutlined />}
                      />
                      <BottomNavigationAction
                          label="Settings"
                          icon={<SettingsOutlined />}
                      />
                    </BottomNavigation>
                  </Paper>
                </>
            )}
          </Container>
        </ThemeProvider>
    );
  };
}

export default App;

import {
  Box,
  Button,
  Stack,
  TextField,
  Chip,
  Autocomplete,
  Snackbar,
  Alert,
  Typography,
} from "@material-ui/core";
import React from "react";
import { v4 as uuidv4 } from 'uuid';

export default function CreatePoll(props: any): React.ReactElement {
  const {
    addresses,
    xNavAvailable,
    balance,
    onSendMultiple,
    wallet,
    destination,
    hideTo,
    pollTitle,
    walletInstance,
    syncProgress, pendingQueue
  } = props

  const [from, setFrom] = React.useState("xnav");
  if (!balance || !balance[from]) return <>Loading</>;
  const [title, setPollTitle] = React.useState(pollTitle);
  const [to, setTo] = React.useState(destination);
  const [errorDest, setErrorDest] = React.useState(false);
  const [errorOptions, setErrorOptions] = React.useState(false);
  const [validUntil, setValidUntil] = React.useState<Date | null>(new Date());
  const [options, setOptions] = React.useState<(string | never[])[]>([]);
  const [receivers, setReceivers] = React.useState<(string | never[])[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleClose = (event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async function getValidVoters(): Promise<any[]> {
    const validVoters = new Array<any>();

    await Promise.all(receivers.map(async (rec) => {
      if (wallet.bitcore.Address.isValid(rec) || walletInstance.IsValidDotNavName(rec))
      {
        let voterAddress;
          if (walletInstance.IsValidDotNavName(rec)) {
            try {
              const resolvedName = await walletInstance.ResolveName(rec);

              if (resolvedName["nav"] && wallet.bitcore.Address.isValid(resolvedName["nav"])) {
                voterAddress = resolvedName["nav"]
                validVoters.push(voterAddress);
              }
            } catch(e) {
              return;
            }
          } else {
            voterAddress = rec.toString()
            validVoters.push(voterAddress);
          }
      }
    }));

    return validVoters;
  }


  return (

    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
      }}
    >

    {syncProgress < 100 && syncProgress >= 0 && (
        <Alert
          sx={{
            maxWidth: 400,
            alignSelf: "center",
            px: 4,
            mt: 2,
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
          severity={"warning"}
        >
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          The wallet is currently syncing, please wait for transactions to confirm.
        </Alert>
      )}
    { 
      xNavAvailable ? null :
        <Box 
          sx={{
            m: 4,
            bgcolor: "#ff0033",
            color: "#fff",
            boxShadow: 2,
            borderRadius: 2,
          }}>
            <Typography
              sx={{
                m: 4,
                mt: 2,
                mb: 2,
                maxWidth: "100%",
                wordWrap: "break-word",
                textAlign: "center",
              }}
              variant={"h5"}
            >
              You need at least 0.1 xNav to be able to create polls. 
          </Typography>
        </Box>
    }
      <Typography
          sx={{
            m: 4,
            mt: 2,
            mb: 2,
            maxWidth: "100%",
            wordWrap: "break-word",
            textAlign: "center",
          }}
          variant={"h4"}
        >
          Create Poll
      </Typography>

      <Box
        sx={{
          maxWidth: 800,
          width: "90%",
          borderRadius: 1,
          mt: 2,
          p: 4,
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

          <TextField
              autoComplete="off"
              id="pollTitle"
              label="Title"
              placeholder="The title of the poll"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={title}
              disabled={!xNavAvailable}
              onChange={(e) => {
                setPollTitle(e.target.value);
              }}
            />

            {hideTo ? (
              <></>
            ) : (
              <>
              {/* RECEIVERS */}
              <Autocomplete
                multiple
                id="tags-filled"
                options={[]}
                defaultValue={[]}
                freeSolo
                disabled={!xNavAvailable}
                onChange={(e, value) => setReceivers(() => value)}
                renderTags={(
                  value: any[],
                  getTagProps: (arg0: { index: any }) => JSX.IntrinsicAttributes
                ) =>
                  value.map((option: any, index: any) => {
                    return (
                      <Chip
                        key={index}
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    );
                  })
                }
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label="Receivers"
                    placeholder="Add a receiver by pressing enter after its dotName or address"
                    error={errorDest}
                  />
                )}
              />
              </>
            )}


            {/* Options */}
            <Autocomplete
              multiple
              id="tags-filled"
              options={[]}
              defaultValue={[]}
              freeSolo
              disabled={!xNavAvailable}
              onChange={(e, value) => setOptions(value)}
              renderTags={(
                value: any[],
                getTagProps: (arg0: { index: any }) => JSX.IntrinsicAttributes
              ) =>
                value.map((option: any, index: any) => {
                  return (
                    <Chip
                      key={index}
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  );
                })
              }
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  label="Options"
                  placeholder="Add an option by pressing enter"
                  error={errorOptions}
                />
              )}
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
            disabled={!xNavAvailable}
            onClick={async () => {

              if(xNavAvailable) {
              const validVoters = await getValidVoters();

              const poll = {
                id: uuidv4(),
                title: title,
                options: options,
                createdBy: Object.entries(addresses["spending"]["private"]).filter((el: any) => el[1].used === 1 && el[1]["balances"]["xnav"].confirmed > 1)[0][0],
                validUntil: new Date(),
                isPoll: true,
                validVoters: validVoters,
              }


              setErrorDest(false)
              let hasDestErrors = false;
              let hasOptionsErrors = false;
              const destinations: { dest: string; amount: number; memo: string; }[] = [];

              // CHECK FOR ERRORS IN THE OPTIONS
              if(options.length < 1) {
                hasOptionsErrors = true
                setErrorOptions(true)
              }

              // CHECK FOR ERRORS IN THE RECEIVERS AND ADD TO DESTINATIONS IF OK
              await Promise.all(receivers.map(async (rec) => {
                if (wallet.bitcore.Address.isValid(rec) || walletInstance.IsValidDotNavName(rec))
                {
                  let voterAddress;
                    if (walletInstance.IsValidDotNavName(rec)) {
                      try {
                        const resolvedName = await walletInstance.ResolveName(rec);

                        if (resolvedName["nav"] && wallet.bitcore.Address.isValid(resolvedName["nav"])) {
                          // valid dotNav name, add to destinations
                          voterAddress = resolvedName["nav"]
                        } else {
                          setErrorDest(true);
                          hasDestErrors = true;
                          return;
                        }
                      } catch(e) {
                        setErrorDest(true);
                        hasDestErrors = true;
                        return;
                      }
                    } else {
                      // valid nav address, add to destinations
                      voterAddress = rec.toString()
                    }

                    destinations.push({
                        dest: voterAddress,
                        amount: 0 * 1e8,
                        memo: JSON.stringify(poll),
                    });
                }
                else {
                  setErrorDest(true);
                  hasDestErrors = true;
                  return;
                }
              }));

              if(!hasDestErrors && !hasOptionsErrors) {
                while((await walletInstance.GetBalance()).xnav.confirmed === 0) {
                  console.log("waiting...")
                  await delay(1000);
                }

                const pollInformationsToSave = new Map<string, any[]>();
                pollInformationsToSave.set("validVoters", validVoters);
                pollInformationsToSave.set("validOptions", options);

                await onSendMultiple(
                  from,
                  destinations,
                  true,
                  `Do you really want to send the poll?`,
                  poll.id,
                  pollInformationsToSave
                );
              }
            }
          }
         }
          >
            Send
          </Button>

          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center"
              }} >
            <Alert severity="success" sx={{ width: '100%' }}>
              Poll successfully sent!
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
}






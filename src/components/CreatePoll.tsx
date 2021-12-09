import {
  Box,
  Button,
  Stack,
  TextField,
  Chip,
  Autocomplete,
  Snackbar,
  Alert,
} from "@material-ui/core";
import React from "react";
import MuiAlert from '@mui/material/Alert';
import { v4 as uuidv4 } from 'uuid';
import { constants } from "fs";

export default function CreatePoll(props: any): React.ReactElement {
  const {
    addresses,
    balance,
    onSendMultiple,
    wallet,
    network,
    destination,
    utxoType,
    address,
    hideTitle,
    hideTo,
    hideFrom,
    pollTitle,
    walletInstance
  } = props

  const [from, setFrom] = React.useState("xnav");
  if (!balance || !balance[from]) return <>Loading</>;
  const [available, setAvailable] = React.useState(
    balance[from].confirmed / 1e8
  );
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


  return (
    
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
      }}
    >

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
            onClick={async () => {

              const poll = {
                id: uuidv4(),
                title: title,
                options: options,
                createdBy: Object.entries(addresses["spending"]["private"]).filter((el: any) => el[1].used === 1 && el[1]["balances"]["xnav"].confirmed > 1)[0][0],
                validUntil: new Date(),
                isPoll: true
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
              receivers.forEach(async (element) => {
                if (wallet.bitcore.Address.isValid(element) || walletInstance.IsValidDotNavName(element))
                {
                    if (walletInstance.IsValidDotNavName(element)) {
                      try {
                        const resolvedName = await walletInstance.ResolveName(element);

                        if (resolvedName["nav"] && wallet.bitcore.Address.isValid(resolvedName["nav"])) {
                          // valid dotNav name, add to destinations
                          console.log("Valid dotNav name")
                          destinations.push(
                            {
                              dest: resolvedName["nav"],
                              amount: 1 * 1e8,
                              memo: JSON.stringify(poll),
                            }
                          )                         
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
                      console.log("Valid nav address")
                      console.log(element)
                      console.log("-----")
                      
                      destinations.push(
                        {
                          dest: element.toString(),
                          amount: 1 * 1e8,
                          memo: JSON.stringify(poll),
                        }
                      )
                    }
                }
                else {
                  setErrorDest(true);
                  hasDestErrors = true;
                  return;
                }
              })

              
              if(!hasDestErrors && !hasOptionsErrors) {
                while((await walletInstance.GetBalance()).xnav.confirmed === 0) {
                  console.log("waiting...")
                  await delay(1000);
                }

                console.log("CreatePoll")
                console.log(destinations)
              
                await delay(2000)
                await onSendMultiple(
                  from,
                  destinations,
                  true,
                  `Do you really want to send the poll?`
                );

                //await delay(500);
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






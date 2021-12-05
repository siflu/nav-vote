import {
  Box,
  Button,
  Stack,
  TextField,
  Chip,
  Autocomplete,
} from "@material-ui/core";
import React from "react";

import { v4 as uuidv4 } from 'uuid';


export default function CreatePoll(props: any): React.ReactElement {
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
  const [message, setMessage] = React.useState("");
  const [validUntil, setValidUntil] = React.useState<Date | null>(new Date());
  const [options, setOptions] = React.useState<(string | never[])[]>([]);
  const [receivers, setReceivers] = React.useState<(string | never[])[]>([]);

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
          
              console.log(poll);
              console.log(receivers)
              setErrorDest(false)
              let hasDestErrors = false;
              let hasOptionsErrors = false;

              // CHECK FOR ERRORS IN THE RECEIVERS
              receivers.forEach(async (element) => {
                if (wallet.bitcore.Address.isValid(element) || walletInstance.IsValidDotNavName(element))
                {
                    if (walletInstance.IsValidDotNavName(element)) {
                
                      try {
                        const resolvedName = await walletInstance.ResolveName(element);

                        if (resolvedName["nav"] && wallet.bitcore.Address.isValid(resolvedName["nav"])) {
                          // all good, do nothing     
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
                    }
                }
                else {
                  setErrorDest(true);
                  hasDestErrors = true;
                  return;
                }
              })

              // CHECK FOR ERRORS IN THE OPTIONS
              if(options.length < 1) {
                hasOptionsErrors = true
                setErrorOptions(true)
              }

              if(!hasDestErrors && !hasOptionsErrors) {
                receivers.forEach(async element => {
                  let destination = element;

                  if (wallet.bitcore.Address.isValid(element) || walletInstance.IsValidDotNavName(element))
                  {
                    if (walletInstance.IsValidDotNavName(element)) {
                      try {
                        const resolvedName = await walletInstance.ResolveName(element);

                        if (resolvedName["nav"] && wallet.bitcore.Address.isValid(resolvedName["nav"])) {
                          destination = resolvedName["nav"]
                        } 
                      } catch(e) {
                        return;
                      }
                    }

                    await onSend(
                      from,
                      destination,
                      1,
                      JSON.stringify(poll),
                      utxoType,
                      address,
                      false,
                      undefined,
                      false
                    );
                  }
                })
              }           
            }
          }
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}






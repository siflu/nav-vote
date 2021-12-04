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
  TextFieldProps,
  Chip,
  Autocomplete,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";

import SplitButton from "./elements/SplitButton";
import { v4 as uuidv4 } from 'uuid';
import { ConstructionRounded } from "@material-ui/icons";


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
  const [message, setMessage] = React.useState("");
  const [validUntil, setValidUntil] = React.useState<Date | null>(new Date());
  const myRef = React.createRef();
  const receiverRef = useRef<string[]>();

  
  const poll = {
      id: '',
      title: '',
      options: '',
      createdBy: '',
      validUntil: new Date(),
      isPoll: true
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
                {/* <TextField
                  autoComplete="off"
                  id="destination"
                  label="Destination"
                  value={to}
                  placeholder="The address that you want to send the poll to"
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
                /> */}


              <Autocomplete
                  multiple
                  id="tags-filled"
                  options={[]}
                  defaultValue={[]}
                  freeSolo
                  renderTags={(value: any[], getTagProps: (arg0: { index: any; }) => JSX.IntrinsicAttributes) => 
                    value.map((option: any, index: any) => {
                      receiverRef.current = value;
             
                      return (
                      <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
                    )})
                  }
                  ref={myRef}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label="Receivers"
                      placeholder="Add a receiver by pressing enter after its dotName or address"               
                    />
                  )}
                  
                />
              </>
            )}

            <TextField
              autoComplete="off"
              id="amount"
              label="Options"
              placeholder="The possible options, separated by a semicolon (;)"
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

              poll.id = uuidv4();
              poll.title = title;
              poll.options = message;
              poll.validUntil = validUntil ?? new Date();
              poll.createdBy = Object.entries(addresses["spending"]["private"]).filter((el: any) => el[1].used === 1 && el[1]["balances"]["xnav"].confirmed > 1)[0][0];

              console.log(receiverRef.current);

              if(receiverRef.current) {

                receiverRef.current.forEach(async (element) => {

                  if (wallet.bitcore.Address.isValid(element) || walletInstance.IsValidDotNavName(element.toLowerCase()))
                  {
                      let destination = element;
                      if (walletInstance.IsValidDotNavName(element.toLowerCase())) {
                        try {
                          const resolvedName = walletInstance.ResolveName(element.toLowerCase());

                          if (resolvedName["nav"] && wallet.bitcore.Address.isValid(resolvedName["nav"])) {
                            destination = resolvedName["nav"];
                          } else {
                            setErrorDest(true);
                            return;
                          }
                        } catch(e) {
                          setErrorDest(true);
                            return;
                        }
                      }
                  }

                  if (!errorDest && element) {
                    await onSend(
                        from,
                        destination,
                        1,
                        JSON.stringify(poll),
                        utxoType,
                        address,
                        false
                    );
                  }
              })
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






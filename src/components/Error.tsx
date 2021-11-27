import WarningSharpIcon from '@material-ui/icons/WarningSharp';
import React from "react";
import Wrapper from "./Wrapper";
import {CardContent, CardHeader, Typography, Box, CardActions, Button} from "@material-ui/core";

function Error(props:any) {
    const {actions} = props;
    return (
        <Wrapper>
            <CardHeader>

            </CardHeader>
            <CardContent sx={{
                pr: '40px',
                pl: '40px',
                textAlign: 'center'
            }
            }>
                <Box sx={{
                    width:'100%',
                    padding: theme => theme.spacing(0, 2, 2, 2),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                <WarningSharpIcon color={"error"} sx={{ fontSize: 60 }}/>
                </Box>
                <Typography>
                {props.children}
                </Typography>
            </CardContent>
            <CardActions>
                {
                    actions ? actions.map((e: any) => {
                        return (
                            <Button key={e.text} onClick={e.action}>{e.text}</Button>
                        )
                    }) : ''
                }

            </CardActions>
        </Wrapper>
    )
}

export default Error;
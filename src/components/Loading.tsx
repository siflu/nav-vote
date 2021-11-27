import WarningSharpIcon from '@material-ui/icons/WarningSharp';
import React from "react";
import Wrapper from "./Wrapper";
import {CardContent, CardHeader, Typography, Box, CardActions, Button, LinearProgress} from "@material-ui/core";

function Loading(props:any) {
    const {actions} = props;
    return (
        <Wrapper>
            <CardHeader>

            </CardHeader>
            <CardContent sx={{
                pr: '40px',
                pl: '40px',
                textAlign: 'center',
                height: '100%',
                overflow: 'none',
                justifyContent: { xs: 'center' } //, sm: 'normal'}
            }
            }>
                <Typography>
                    {props.children}
                </Typography>
                <LinearProgress color="secondary" sx={{
                    my: 2
                }} />

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

export default Loading;
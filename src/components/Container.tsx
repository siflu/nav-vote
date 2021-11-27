import * as React from "react";
import styled from "@emotion/styled";
import Container from "@material-ui/core/Container";
import { keyframes } from '@emotion/react'

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

function container(props:any) {
    return (
      <Container sx={{
          display: "flex",
          alignItems: ["start"], //, "center"],
          justifyContent: ["start"], //, "center"],
          width: '100vw',
          height: '100vh',
          flexDirection: 'column',
          maxHeight: '-webkit-fill-available',
          animation: fadeIn + ' 1%s ease 0s normal 1',
          px: ['0px', '0px', '0px', '0px', '0px', '0px']
      }}>
          {props.children}
      </Container>
    );
}


export default container;
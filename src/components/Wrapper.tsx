import * as React from "react";
import { Card } from "@material-ui/core";

function Wrapper(props: any) {
  return (
    <Card
      sx={{
        minWidth: ["100%"], //, '400px'],
        minHeight: ["100%"], //, '100px'],
        maxWidth: ["100%"], //, '400px'],
        alignItems: "center",
        flexDirection: "column",
        display: "flex",
      }}
    >
      {props.children}
    </Card>
  );
}

export default Wrapper;

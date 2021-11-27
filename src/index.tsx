import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const njs = require("navcoin-js");

njs.wallet.Init().then(async () => {
  ReactDOM.render(
    <React.StrictMode>
      <App njs={njs} />
    </React.StrictMode>,
    document.getElementById("root")
  );
});

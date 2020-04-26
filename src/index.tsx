// tslint:disable:ordered-imports

import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";

import App from "./components/app";

declare global {
  interface BeforeInstallProptEvent extends Event {
    userChoice: Promise<{ outcome: "accepted" | unknown }>;

    prompt: () => void;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Router from "./Router/Router.jsx";
import Provider from "./Context/Context.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider>
    <Router />
  </Provider>
);

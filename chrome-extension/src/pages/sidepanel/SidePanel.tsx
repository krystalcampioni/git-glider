import React, { useState, useEffect } from "react";
import "@pages/sidepanel/SidePanel.scss";
import useStorage from "@src/shared/hooks/useStorage";

import withSuspense from "@src/shared/hoc/withSuspense";
import withErrorBoundary from "@src/shared/hoc/withErrorBoundary";
import githubStorage from "@root/src/shared/storages/githubStorage";
import logo from "@assets/img/logo.png";
import { TokenInstructions } from "./TokenInstructions";

const SidePanel = () => {
  const { token } = useStorage(githubStorage);

  const handleTokenSubmit = (event) => {
    event.preventDefault();
    const newToken = event.target.elements.token.value;
    githubStorage.setGliderData({ token: newToken });
  };

  if (token === null) {
    return (
      <div className="AppWrapper">
        <img src={logo} className="logo" />
        <form onSubmit={handleTokenSubmit} className="form">
          <h1 className="title">Welcome to Git Glider</h1>
          <p className="description">Enter your GitHub token to get started</p>

          <div className="group">
            <input name="token" type="password" required />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>GitHub Token:</label>
          </div>
          <input className="submit" type="submit" value="Submit" />
        </form>

        <TokenInstructions />
      </div>
    );
  }

  return <div className="App"> hello</div>;
};

export default withErrorBoundary(
  withSuspense(SidePanel, <div> Loading ... </div>),
  <div> Error Occur </div>
);

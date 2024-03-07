import { useState } from "react";
import { Header } from "../Header";
import { findPrs } from "@root/src/shared/find-prs";
import useStorage from "@root/src/shared/hooks/useStorage";
import githubStorage from "@root/src/shared/storages/githubStorage";

import "./Home.scss";

export function Home() {
  const { token } = useStorage(githubStorage);

  const [prs, setPrs] = useState([]);

  const owner = "facebook";
  const repo = "react";
  const author = "gaearon";
  const fileExtension = "js";
  const since = "2021-01-01";
  const accessToken = token;
  const state = "ALL";

  const handleClick = async () => {
    const prs = [];

    const x = await findPrs({
      owner,
      repo,
      author,
      fileExtension,
      since,
      accessToken,
      state,
      prs,
      cursor: null,
    });
    setPrs(x);
  };

  const getPrNumber = (pr) => {
    return pr.number;
  };

  const getRepoUrl = () => {
    return `${owner}/${repo}`;
  };

  const getPrFooter = (pr) => {
    switch (pr.state) {
      case "OPEN":
        return (
          <a target="_blank" href={pr.url}>
            #{getPrNumber(pr)} was opened by {pr.author.login} on {pr.createdAt}
          </a>
        );
      case "CLOSED":
        return (
          <a target="_blank" href={pr.url}>
            #{getPrNumber(pr)} was closed on {pr.closedAt}
          </a>
        );
      case "MERGED":
        return (
          <a target="_blank" href={pr.url}>
            #{getPrNumber(pr)} was merged by {pr.mergedBy.login} on{" "}
            {pr.mergedAt}
          </a>
        );
      default:
        return "";
    }
  };

  return (
    <>
      <Header />
      <div className="AppWrapper">
        <button onClick={handleClick}>HEY</button>
        <ul className="Prs">
          {prs.map((pr) => {
            return (
              <li>
                <h3 className="PrHeader">
                  <a className="repo">{getRepoUrl()}</a>
                  {pr.title}
                </h3>
                {getPrFooter(pr)}
              </li>
            );
          })}
        </ul>

        <h1 className="title">What would you like to do now?</h1>
      </div>
    </>
  );
}

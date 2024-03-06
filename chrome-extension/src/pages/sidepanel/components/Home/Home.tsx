import { useState } from "react";
import { Header } from "../Header";
import { findPrs } from "@root/src/shared/find-prs";
import useStorage from "@root/src/shared/hooks/useStorage";
import githubStorage from "@root/src/shared/storages/githubStorage";

import "./Home.scss";

export function Home() {
  const { token } = useStorage(githubStorage);

  const [prs, setPrs] = useState([]);

  const handleClick = async () => {
    console.log("HEY");
    const owner = "facebook";
    const repo = "react";
    const author = "gaearon";
    const fileExtension = "js";
    const since = "2021-01-01";
    const accessToken = token;
    const state = "merged";
    const page = 1;
    const prs = [];

    const x = await findPrs({
      owner,
      repo,
      author,
      fileExtension,
      since,
      accessToken,
      state,
      page,
      prs,
    });
    setPrs(x);
    console.log(x);
  };

  const getPrNumber = (url) => {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  };

  const getRepoUrl = (url) => {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 3];
  };

  return (
    <div className="AppWrapper">
      <Header />
      <button onClick={handleClick}>HEY</button>
      <ul className="Prs">
        {prs.map((pr) => {
          const url = pr?.pull_request?.html_url;
          console.log(pr);
          return (
            <li>
              <a className="repo">{getRepoUrl(url)}</a>
              <a href={url}>#{getPrNumber(url)}</a>
              {pr.title}
            </li>
          );
        })}
      </ul>

      <h1 className="title">What would you like to do now?</h1>
    </div>
  );
}

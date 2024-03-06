import { useState } from "react";
import { findPrs } from "@root/src/shared/find-prs";
import useStorage from "@root/src/shared/hooks/useStorage";
import githubStorage from "@root/src/shared/storages/githubStorage";

import "./PrSearch.scss";
import SearchForm from "./SearchForm";
import { PrOpenIcon, PrMergedIcon, PrClosedIcon } from "../../PrIcons";

const PrHeader = ({ href, title, icon: Icon, children }) => (
  <h3 className="PrHeader">
    {<Icon />}
    <span>
      <a className="repo">{href}</a>
      {title}
      {children}
    </span>
  </h3>
);

export function PrSearch() {
  const { token } = useStorage(githubStorage);

  const [prs, setPrs] = useState([]);

  const accessToken = token;
  const page = 1;

  const handleSubmit = async (data) => {
    const prs = [];

    const { owner, repo, author, fileExtension, since, state = "all" } = data;

    console.log("Requested with", {
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

    const result = await findPrs({
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
    setPrs(result);
  };

  const getPrNumber = (url) => {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  };

  const getRepoUrl = (url) => {
    return url.split("/").slice(3, 5).join("/");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getPrMarkup = (pr) => {
    const href = pr.pull_request.html_url;

    if (pr.state === "open") {
      return (
        <PrHeader href={getRepoUrl(href)} title={pr.title} icon={PrOpenIcon}>
          {" "}
          <a target="_blank" href={href}>
            #{getPrNumber(pr)} was opened by {pr.author.login} on{" "}
            {formatDate(pr.created_at)}
          </a>
        </PrHeader>
      );
    }

    if (pr.pull_request.merged_at) {
      return (
        <PrHeader href={getRepoUrl(href)} title={pr.title} icon={PrMergedIcon}>
          <a target="_blank" href={href} className="PrLink">
            #{getPrNumber(href)} was merged on{" "}
            {formatDate(pr.pull_request.merged_at)}
          </a>
        </PrHeader>
      );
    }

    return (
      <PrHeader href={getRepoUrl(href)} title={pr.title} icon={PrClosedIcon}>
        {" "}
        <a target="_blank" href={href}>
          #{getPrNumber(href)} was closed on {formatDate(pr.closed_at)}
        </a>
      </PrHeader>
    );
  };

  return (
    <>
      <SearchForm onSubmit={handleSubmit} />
      <ul className="Prs">
        {prs.map((pr) => {
          return <li>{getPrMarkup(pr)}</li>;
        })}
      </ul>
    </>
  );
}

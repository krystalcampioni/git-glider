import axios from "axios";
import useStorage from "./hooks/useStorage";
import githubStorage from "./storages/githubStorage";

interface Params {
  owner: string;
  repo: string;
  author: string;
  fileExtension: string;
  since: string;
  accessToken: string;
  state: "merged" | "open" | "closed" | "all";
  page: number;
  prs: Object[];
}
export async function findPrs({
  owner,
  repo,
  author,
  fileExtension,
  since,
  accessToken,
  state = "all",
  page = 1,
  prs = [],
}: Params) {
  const url = `https://api.github.com/search/issues?q=repo:${owner}/${repo}+author:${author}+is:pr+created:>=${since}&per_page=100&page=${page}`;
  const headers = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `token ${accessToken}`,
  };

  const response = await axios.get(url, { headers });
  let data = response.data.items; // Search results are in the items property

  // const spinner = ora("Loading PRs").start();

  // Filter PRs according to the state
  if (state !== "all") {
    data = data.filter(
      (pr) =>
        pr.state === state || (state === "merged" && pr.pull_request.merged_at)
    );
  }

  console.log(">>>>>", { data });

  // Fetch the files for the remaining PRs
  const fileRequests = data.map((pr) =>
    axios.get(pr.pull_request.url + "/files", { headers })
  );

  const fileResponses = await Promise.all(
    fileRequests.map((p) => p.catch((e) => e))
  );

  console.log(">>>>>", { fileResponses });

  for (let i = 0; i < fileResponses.length; i++) {
    if (fileResponses[i].status === 200) {
      const filesData = fileResponses[i].data;

      if (filesData.some((file) => file.filename.endsWith(fileExtension))) {
        prs.push(data[i]);
      }
    }

    if (parseInt(fileResponses[i].headers["x-ratelimit-remaining"]) === 0) {
      const resetTime = new Date(
        parseInt(fileResponses[i].headers["x-ratelimit-reset"]) * 1000
      );
      const currentTime = new Date();

      const waitTime = resetTime.getTime() - currentTime.getTime() + 10000; // Add 10 seconds to ensure the rate limit has reset

      // spinner.color = "yellow";
      // spinner.text = "Waiting for rate limit to reset";
      await sleep(waitTime);
    }
  }

  // spinner.stop();

  const linkHeader = response.headers.link;
  if (linkHeader && linkHeader.includes(`rel="next"`)) {
    return findPrs({
      owner,
      repo,
      author,
      fileExtension,
      since,
      accessToken,
      state,
      page: page + 1,
      prs,
    });
  } else {
    return prs;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

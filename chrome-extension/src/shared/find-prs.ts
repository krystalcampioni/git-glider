import axios from "axios";
import ora from "ora";
import fs from "fs";
import chalk from "chalk";

function colorPrint(text, color, bold) {
  if (bold) {
    console.log(chalk.bold[color](text));
    return;
  }
  console.log(chalk[color](text));
}

async function findPrs(
  owner,
  repo,
  author,
  fileExtension,
  since,
  accessToken,
  state = "all",
  page = 1,
  prs = []
) {
  const url = `https://api.github.com/search/issues?q=repo:${owner}/${repo}+author:${author}+is:pr+created:>=${since}&per_page=100&page=${page}`;
  const headers = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `token ${accessToken}`,
  };

  const response = await axios.get(url, { headers });
  let data = response.data.items; // Search results are in the items property

  const spinner = ora("Loading PRs").start();

  // Filter PRs according to the state
  if (state !== "all") {
    data = data.filter(
      (pr) =>
        pr.state === state || (state === "merged" && pr.pull_request.merged_at)
    );
  }

  // Fetch the files for the remaining PRs
  const fileRequests = data.map((pr) =>
    axios.get(pr.pull_request.url + "/files", { headers })
  );

  const fileResponses = await Promise.all(
    fileRequests.map((p) => p.catch((e) => e))
  );

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

      spinner.color = "yellow";
      spinner.text = "Waiting for rate limit to reset";
      await sleep(waitTime);
    }
  }

  spinner.stop();

  const linkHeader = response.headers.link;
  if (linkHeader && linkHeader.includes(`rel="next"`)) {
    return findPrs(
      owner,
      repo,
      author,
      fileExtension,
      since,
      accessToken,
      state,
      page + 1,
      prs
    );
  } else {
    return prs;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const owner = process.argv[2];
  const repo = process.argv[3];
  const author = process.argv[4];
  const fileExtension = process.argv[5];
  const since = process.argv[6];
  const state = process.argv[7]; // Get state from command line arguments

  // Read the access token from github-token.txt
  const accessToken = fs.readFileSync("github-token.txt", "utf8").trim();

  const prs = await findPrs(
    owner,
    repo,
    author,
    fileExtension,
    since,
    accessToken,
    state
  );

  for (const pr of prs) {
    console.log("----");
    console.log(pr.pull_request.merged_at);
    colorPrint(pr.pull_request.html_url, "cyan");
    colorPrint(pr.title, "cyanBright");
    console.log("----");
  }

  console.log(
    `Found ${prs.length} PRs by ${author} in ${owner}/${repo} with a ${fileExtension} file.`
  );
}

main().catch(console.error);

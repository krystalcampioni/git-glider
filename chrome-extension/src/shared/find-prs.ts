import { graphql } from "@octokit/graphql";
import { createTokenAuth } from "@octokit/auth";

import { gql } from "./graphql/gql";
import pullRequestsQuery from "./graphql/pullRequests.graphql";

interface File {
  path: string;
}

interface PullRequest {
  number: number;
  state: string;
  mergedAt: string;
  files: {
    nodes: File[];
  };
}

interface Search {
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
  nodes: PullRequest[];
}

interface GraphQLResponse {
  search: Search;
}

interface Params {
  owner: string;
  repo: string;
  author: string;
  fileExtension: string;
  since: string;
  state: "MERGED" | "OPEN" | "CLOSED" | "ALL";
  cursor: string | null;
  prs: Object[];
  accessToken: string;
}

interface File {
  path: string;
}

interface PullRequest {
  number: number;
  state: string;
  mergedAt: string;
  files: {
    nodes: File[];
  };
}

interface Search {
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
  nodes: PullRequest[];
}

interface GraphQLResponse {
  search: Search;
}

export async function findPrs({
  owner,
  repo,
  author,
  fileExtension,
  since,
  state = "ALL",
  cursor = null,
  prs = [],
  accessToken,
}: Params) {
  const auth = createTokenAuth(accessToken);

  const authentication = await auth();

  let stateQuery = "";
  if (state !== "ALL") {
    stateQuery = `state: ${state}`;
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${authentication.token}`,
    },
  });

  const response: GraphQLResponse = await graphqlWithAuth(
    gql(pullRequestsQuery),
    {
      searchQuery: `repo:${owner}/${repo} author:${author} is:pr created:>=${since} ${stateQuery}`,
      cursor,
    }
  );
  let prsData = response.search.nodes;

  for (const pr of prsData) {
    if (pr.files.nodes.some((file) => file.path.endsWith(fileExtension))) {
      prs.push(pr);
    }
  }

  if (response.search.pageInfo.hasNextPage) {
    return findPrs({
      owner,
      repo,
      author,
      fileExtension,
      since,
      state,
      cursor: response.search.pageInfo.endCursor,
      prs,
      accessToken,
    });
  } else {
    return prs;
  }
}

export interface File {
  path: string;
}

export interface PullRequest {
  number: number;
  state: string;
  mergedAt: string;
  files: {
    nodes: File[];
  };
}

export interface Search {
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
  nodes: PullRequest[];
}

export interface GraphQLResponse {
  search: Search;
}

export interface Params {
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

export interface File {
  path: string;
}

export interface PullRequest {
  number: number;
  state: string;
  mergedAt: string;
  files: {
    nodes: File[];
  };
}

export interface Search {
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
  nodes: PullRequest[];
}

export interface GraphQLResponse {
  search: Search;
}

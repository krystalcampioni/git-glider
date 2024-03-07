import { graphql } from "@octokit/graphql";
import { createTokenAuth } from "@octokit/auth";
import githubStorage from "../storages/githubStorage";
import useStorage from "./useStorage";
import { useEffect } from "react";
import { GraphQLResponse } from "../types";
import { gql } from "../graphql/gql";

export function useGraphQL(query: any, variables?: any) {
  let loading = true;
  let error = null;
  let data = null;

  const { token } = useStorage(githubStorage);

  useEffect(() => {
    const fetchData = async () => {
      const auth = createTokenAuth(token);
      const authentication = await auth();

      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `token ${authentication.token}`,
        },
      });

      try {
        const response: GraphQLResponse = await graphqlWithAuth(
          gql(query),
          variables
        );
        data = response;
      } catch (err) {
        error = err;
      } finally {
        loading = false;
      }
    };

    fetchData();
  }, []);

  return { loading, error, data };
}

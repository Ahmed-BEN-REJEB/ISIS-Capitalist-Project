import { inject, makeEnvironmentProviders } from "@angular/core";
import {
  InMemoryCache,
  provideApollo,
  withApolloOptions,
  type ApolloOptions,
} from "@apollo-orbit/angular";
import { HttpLinkFactory, withHttpLink } from "@apollo-orbit/angular/http";
import { defaultOrigin } from "../../lib/api";

export function provideGraphQL() {
  return makeEnvironmentProviders([
    provideApollo(
      withApolloOptions((): ApolloOptions => ({
        cache: new InMemoryCache(),
        // Identical product IDs can belong to different players or servers.
        // Read authoritative worlds without cross-session cache reuse.
        queryDeduplication: false,
        defaultOptions: {
          watchQuery: { fetchPolicy: "no-cache" },
          query: { fetchPolicy: "no-cache" },
          mutate: { fetchPolicy: "no-cache" },
        },
        link: inject(HttpLinkFactory).create({
          uri: defaultOrigin + "/graphql",
        }),
      })),
      withHttpLink(),
    ),
  ]);
}

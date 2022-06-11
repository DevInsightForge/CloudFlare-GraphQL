import { ApolloServer, gql } from 'apollo-server-cloudflare';
import { graphqlCloudflare } from 'apollo-server-cloudflare/dist/cloudflareApollo';
import RootQuery from './schema/Resolvers/RootQuery';
import Mutation from './schema/Resolvers/Mutation';
import { GraphQLSchema } from 'graphql';

const server = new ApolloServer({
  schema: new GraphQLSchema({ query: RootQuery, mutation: Mutation }),
  introspection: true,
  csrfPrevention: true,
  cors: {
    origin: '*',
    credentials: true
  },
})

const startServer = server.start();

const handleRequest = async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Allow-Credentials": true,
      }
    });
  }
  try {
    await startServer;
    return graphqlCloudflare(() => server.createGraphQLServerOptions(request))(
      request
    )
  } catch (error) {
    return new Response(error, { status: 500 });
  }
}

// Listen for incoming requests
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
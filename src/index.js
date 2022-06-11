import { ApolloServer } from 'apollo-server-cloudflare';
import schema from './schema';

const server = new ApolloServer({
  schema,
  introspection: true,
  // csrfPrevention: true,
  cors: {
    origin: '*',
    credentials: true
  },
  // createGraphQLServerOptions: async (request) => {
  //   return {
  //     context: {
  //       headers: request.headers,
  //       ip: request.ip,
  //       user: request.user
  //     }
  //   };
  // }
})

const startServer = server.start();

const handleRequest = async (request) => {
  // if (request.method !== "POST") {
  //   return new Response(`Method ${request.method} not allowed`, { status: 405 });
  // }
  try {
    await startServer;
    // return graphqlCloudflare(() => server.createGraphQLServerOptions(request))(
    //   request
    // )
    return await server.listen(request);
  } catch (error) {
    return new Response(error, { status: 500 });
  }
}

// Listen for incoming requests
addEventListener('fetch', event => server.listen(event.request));

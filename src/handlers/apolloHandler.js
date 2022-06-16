import jwt from "@tsndr/cloudflare-worker-jwt";
import { ApolloServer } from "apollo-server-cloudflare";
import { graphqlCloudflare } from "apollo-server-cloudflare/dist/cloudflareApollo";
import schema from "../schema";

const server = new ApolloServer({
  schema,
  introspection: true, // enable introspection in apollo studio
  csrfPrevention: true, // enable csrf prevention in apollo studio
  cache: "bounded",
  context: async ({ request }) => {
    const authorization = request.headers.get("authorization");
    try {
      if (!authorization) throw new Error("No authorization header found");
      const token = authorization.split(" ")[1];
      const isValid = await jwt.verify(token, `cgqlJWT`);
      if (!isValid)
        throw new Error("Provided token is either expired or invalid.");

      const { payload } = jwt.decode(token);
      return {
        user: payload,
      };
    } catch (error) {
      return {
        authError: error.message,
      };
    }
  },
});

const serverStartTrigger = server.start();

const apolloHandler = async (request) => {
  await serverStartTrigger;
  const result = await graphqlCloudflare(
    () => server.createGraphQLServerOptions(request),
    server.csrfPreventionRequestHeaders
  )(request);
  return result;
};

export default apolloHandler;

import { ApolloServer } from 'apollo-server-cloudflare';
import { graphqlCloudflare } from 'apollo-server-cloudflare/dist/cloudflareApollo';
import schema from '../schema';

const server = new ApolloServer({
    schema,
    introspection: true,
    cors: {
        origin: '*',
        credentials: true
    },
})

const serverStartTrigger = server.start();

const apolloHandler = async request => {
    await serverStartTrigger;
    const result = await graphqlCloudflare(
        () => server.createGraphQLServerOptions(request),
        server.csrfPreventionRequestHeaders)(request);
    return result;
}

export default apolloHandler;

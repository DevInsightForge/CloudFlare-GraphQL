import { GraphQLSchema } from 'graphql';
import RootQuery from './Resolvers/RootQuery';
import Mutation from './Resolvers/Mutation';

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

export default schema;
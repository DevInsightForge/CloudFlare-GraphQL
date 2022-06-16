import { GraphQLSchema } from "graphql";
import Mutation from "./Resolvers/Mutation";
import RootQuery from "./Resolvers/RootQuery";

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default schema;

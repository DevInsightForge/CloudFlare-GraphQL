import { GraphQLObjectType } from "graphql";
import RefreshAccess from "./Mutations/RefreshAccess";
import SignIn from "./Mutations/SignIn";
import SignUp from "./Mutations/SignUp";

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signup: SignUp,
    signin: SignIn,
    RefreshAccess: RefreshAccess,
  },
});

export default Mutation;

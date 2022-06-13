import { GraphQLObjectType } from "graphql";
import RefreshJWT from "./Mutations/RefreshJWT";
import SignIn from './Mutations/SignIn';
import SignUp from './Mutations/SignUp';

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        signup: SignUp,
        signin: SignIn,
        refreshJWT: RefreshJWT
    },
});

export default Mutation;
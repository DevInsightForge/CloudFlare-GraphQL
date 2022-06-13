import { GraphQLObjectType } from "graphql";
import SignIn from './Mutations/SignIn';
import SignUp from './Mutations/SignUp';

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        signup: SignUp,
        signin: SignIn
    },
});

export default Mutation;
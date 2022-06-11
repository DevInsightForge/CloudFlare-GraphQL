import { GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "../TypeDefs/UserType";
import { AuthenticationError } from "apollo-server-core";
import pgClient from "../../utils/pgClient";

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        // signup: {
        //     type: UserType,
        //     args: {
        //         name: { type: GraphQLString },
        //         email: { type: GraphQLString },
        //         password: { type: GraphQLString },
        //     },
        //     async resolve(parent, args) {
        //         // const userExists = await UserModel.findOne({ email: args.email });
        //         if (userExists) {
        //             throw new AuthenticationError("User with this email already exists");
        //         }
        //         const payload = {
        //             name: args.name,
        //             email: args.email,
        //             password: args.password,
        //         }
        //         // const newUser = await UserModel.create(payload);
        //         const { password, ...userReturn } = newUser.toObject();
        //         return userReturn;
        //     },
        // },
        signin: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            async resolve(parent, args) {
                const { data: user, error } = await pgClient
                    .from('users')
                    .select("*")
                    .eq('email', args.email)
                    .single();
                if (user && user.password === args.password) {
                    const { password, ...userReturn } = user;
                    return userReturn;
                }
                else {
                    throw new AuthenticationError("Invalid Credentials. Please Try Again!");
                }
            }
        }
    },
});

export default Mutation;
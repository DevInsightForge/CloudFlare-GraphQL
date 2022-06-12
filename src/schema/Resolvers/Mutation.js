import { GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "../TypeDefs/UserType";
import { AuthenticationError } from "apollo-server-core";
import pgClient from "../../utils/pgClient";

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        signup: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            async resolve(parent, args) {

                // validate email and password
                if (!args.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
                    throw new AuthenticationError("Invalid Email Address");
                if (!args.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
                    throw new AuthenticationError("Password must contain at least one uppercase, one lowercase, one number and one special character");

                const payload = {
                    name: args.name,
                    email: args.email.toLowerCase(),
                    password: args.password,
                }
                const { data: newUser, error } = await pgClient
                    .from('users')
                    .insert(payload)
                    .single()

                if (error) throw new AuthenticationError(error.details);

                const { password, ...userReturn } = newUser;
                return userReturn;
            },
        },
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
                    .eq('email', args.email.toLowerCase())
                    .single();

                if (error) throw new AuthenticationError("No user associated with this email. Please sign up.");

                if (user && user.password === args.password) {
                    const { password, ...userReturn } = user;
                    return userReturn;
                }
                else {
                    throw new AuthenticationError("Incorrect password. Please Try Again!");
                }
            }
        }
    },
});

export default Mutation;
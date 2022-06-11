import { GraphQLList, GraphQLObjectType } from "graphql";
import pgClient from "../../utils/pgClient";
import UserType from "../TypeDefs/UserType";

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            async resolve(parent, args) {
                const { data: users, error } = await pgClient
                    .from('users')
                    .select('*')

                if (error) {
                    throw new Error(error)
                }
                return users
            },
        }
    },
});

export default RootQuery;
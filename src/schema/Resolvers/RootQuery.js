import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "../TypeDefs/UserType";

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            async resolve(parent, args) {
                // const users = await UserModel.find({});
                // return users;
                return [ {
                    name: "John Doe",
                    email: "abc@gt.com",
                    password: "123456"
                } ]
            },
        }
    },
});

export default RootQuery;
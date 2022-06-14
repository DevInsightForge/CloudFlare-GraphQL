import { GraphQLObjectType } from "graphql";
import GetAllUsers from "./Queries/GetAllUsers";
import GetOwnUser from "./Queries/GetOwnUser";

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: GetAllUsers,
        getOwnUser: GetOwnUser,
    },
});

export default RootQuery;
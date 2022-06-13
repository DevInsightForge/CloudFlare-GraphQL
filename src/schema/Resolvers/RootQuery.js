import { GraphQLObjectType } from "graphql";
import GetAllUsers from "./Queries/GetAllUsers";

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: GetAllUsers
    },
});

export default RootQuery;
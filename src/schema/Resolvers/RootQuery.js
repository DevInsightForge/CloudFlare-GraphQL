import { GraphQLObjectType } from "graphql";
import GetAllUsers from "./Queries/GetAllUsers";
import GetOwnProfile from "./Queries/GetOwnProfile";

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: GetAllUsers,
        getOwnProfile: GetOwnProfile,
    },
});

export default RootQuery;
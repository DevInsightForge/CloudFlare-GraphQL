import { GraphQLObjectType } from "graphql";
import GetAllUsers from "./Queries/GetAllUsers";
import GetAllOpenUsers from "./Queries/GetAllOpenUsers";
import GetOwnUser from "./Queries/GetOwnUser";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllOpenUsers: GetAllOpenUsers,
    getAllUsers: GetAllUsers,
    getOwnUser: GetOwnUser,
  },
});

export default RootQuery;

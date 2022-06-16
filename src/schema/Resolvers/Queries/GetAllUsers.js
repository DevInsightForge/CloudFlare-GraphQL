import { AuthenticationError } from "apollo-server-cloudflare";
import { GraphQLList } from "graphql";
import pgClient from "../../../utils/pgClient";
import UserType from "../../TypeDefs/UserType";

const GetAllUsers = {
  type: new GraphQLList(UserType),
  async resolve(parent, args, { authError }) {
    if (authError) throw new AuthenticationError(authError);

    const { data: users, error } = await pgClient.from("users").select("*");

    if (error) throw new Error("Error getting user list from database");

    // remove password from response
    users.forEach((user) => delete user.password);
    return users;
  },
};

export default GetAllUsers;

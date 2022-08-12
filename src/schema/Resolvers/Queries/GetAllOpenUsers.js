import { GraphQLList } from "graphql";
import pgClient from "../../../utils/pgClient";
import UserType from "../../TypeDefs/UserType";

const GetAllOpenUsers = {
  type: new GraphQLList(UserType),
  async resolve(parent, args) {
    const { data: users, error } = await pgClient.from("Users").select("*");

    if (error) throw new Error("Error getting user list from database");

    // remove password from response
    users.forEach((user) => delete user.password);
    return users;
  },
};

export default GetAllOpenUsers;

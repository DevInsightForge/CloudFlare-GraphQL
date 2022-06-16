import { AuthenticationError } from "apollo-server-cloudflare";
import pgClient from "../../../utils/pgClient";
import UserType from "../../TypeDefs/UserType";

const GetOwnUser = {
  type: UserType,
  async resolve(parent, args, { user, authError }) {
    if (authError) throw new AuthenticationError(authError);

    const { data, error } = await pgClient
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw new Error("Error getting user from database");

    // remove password from response
    delete data.password;
    return data;
  },
};

export default GetOwnUser;

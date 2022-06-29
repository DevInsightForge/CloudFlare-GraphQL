import { AuthenticationError } from "apollo-server-cloudflare";
import pgClient from "../../../utils/pgClient";
import UserType from "../../TypeDefs/UserType";

const GetOwnUser = {
  type: UserType,
  async resolve(_, args, { user, authError }) {
    if (authError) throw new AuthenticationError(authError);
    const { data: ownUser, error } = await pgClient
      .from("Users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw new AuthenticationError("User not found");

    delete ownUser.password;
    return ownUser;
  },
};

export default GetOwnUser;

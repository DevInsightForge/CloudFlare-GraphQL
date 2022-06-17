import { AuthenticationError } from "apollo-server-cloudflare";
import UserType from "../../TypeDefs/UserType";

const GetOwnUser = {
  type: UserType,
  async resolve(_, args, { user, authError }) {
    if (authError) throw new AuthenticationError(authError);
    return user;
  },
};

export default GetOwnUser;

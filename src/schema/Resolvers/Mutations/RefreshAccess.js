import jwt from "@tsndr/cloudflare-worker-jwt";
import { AuthenticationError } from "apollo-server-cloudflare";
import { GraphQLString } from "graphql";
import pgClient from "../../../utils/pgClient";

const RefreshAccess = {
  type: GraphQLString,
  args: {
    refreshToken: { type: GraphQLString },
  },
  async resolve(_, { refreshToken }) {
    try {
      if (!refreshToken) throw new Error("No refresh token provided");
      const token = refreshToken.split(" ")[1];
      const isValid = await jwt.verify(token, SECRET);
      const { payload } = jwt.decode(token);
      if (!isValid || !payload.email)
        throw new Error("Provided token is either expired or invalid.");

      const { data: user, error } = await pgClient
        .from("users")
        .select("*")
        .eq("email", payload.email.toLowerCase())
        .single();

      if (error)
        throw new Error("No user associated with this token. Please sign up.");

      return (
        "Bearer " +
        (await jwt.sign(
          {
            id: user.id,
            name: user.name,
            exp: Math.floor(Date.now() / 1000) + 12 * (60 * 60), // Expires: Now + 12h
          },
          SECRET
        ))
      );
    } catch (error) {
      throw new AuthenticationError(error.message);
    }
  },
};

export default RefreshAccess;

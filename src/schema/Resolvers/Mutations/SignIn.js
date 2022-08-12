import jwt from "@tsndr/cloudflare-worker-jwt";
import { AuthenticationError } from "apollo-server-cloudflare";
import bcrypt from "bcryptjs";
import { GraphQLString } from "graphql";
import pgClient from "../../../utils/pgClient";
import TokenType from "../../TypeDefs/TokenType";

const SignIn = {
  type: TokenType,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(_, args) {
    try {
      const { data: user, error } = await pgClient
        .from("Users")
        .select("*")
        .eq("email", args?.email?.toLowerCase())
        .single();

      if (error)
        throw new Error("No user associated with this email. Please sign up.");

      const authorized = await bcrypt.compare(args?.password, user.password);
      if (!authorized) throw new Error("Incorrect password. Please Try Again!");

      const userToken = {
        accessToken:
          "Bearer " +
          (await jwt.sign(
            {
              id: user.id,
              name: user.name,
              exp: Math.floor(Date.now() / 1000) + 12 * (60 * 60), // Expires: Now + 12h
            },
            SECRET
          )),

        refreshToken:
          "Bearer " +
          (await jwt.sign(
            {
              id: user.id,
              email: user.email,
              exp: Math.floor(Date.now() / 1000) + 7 * (24 * 60 * 60), // Expires: Now + 7d
            },
            SECRET
          )),
      };

      return userToken;
    } catch (error) {
      throw new AuthenticationError(error.message);
    }
  },
};

export default SignIn;

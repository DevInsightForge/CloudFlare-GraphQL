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
    const { data: user, error } = await pgClient
      .from("users")
      .select("*")
      .eq("email", args.email.toLowerCase())
      .single();

    if (error)
      throw new AuthenticationError(
        "No user associated with this email. Please sign up."
      );

    const { id, name, email, password } = user;
    const authorized = await bcrypt.compare(args.password, password);
    if (!authorized)
      throw new AuthenticationError("Incorrect password. Please Try Again!");

    const userToken = {
      accessToken:
        "Bearer " +
        (await jwt.sign(
          {
            id,
            name,
            exp: Math.floor(Date.now() / 1000) + 12 * (60 * 60), // Expires: Now + 12h
          },
          SECRET
        )),

      refreshToken:
        "Bearer " +
        (await jwt.sign(
          {
            id,
            email,
            exp: Math.floor(Date.now() / 1000) + 7 * (24 * 60 * 60), // Expires: Now + 7d
          },
          SECRET
        )),
    };

    return userToken;
  },
};

export default SignIn;

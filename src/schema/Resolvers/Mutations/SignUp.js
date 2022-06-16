import jwt from "@tsndr/cloudflare-worker-jwt";
import { AuthenticationError } from "apollo-server-cloudflare";
import { GraphQLString } from "graphql";
import pgClient from "../../../utils/pgClient";
import TokenType from "../../TypeDefs/TokenType";

const SignUp = {
  type: TokenType,
  args: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args) {
    // validate email and password
    if (!args.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      throw new AuthenticationError("Invalid Email Address");
    if (
      !args.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
      throw new AuthenticationError(
        "Password must contain at least one uppercase, one lowercase, one number and one special character"
      );

    const payload = {
      name: args.name,
      email: args.email.toLowerCase(),
      password: args.password,
    };
    const {
      data: { id, name, email },
      error,
    } = await pgClient.from("users").insert(payload).single();

    if (error)
      throw new AuthenticationError("Email already exists. Please sign in.");

    const userToken = {
      accessToken: await jwt.sign(
        {
          id,
          name,
          exp: Math.floor(Date.now() / 1000) + 12 * (60 * 60), // Expires: Now + 12h
        },
        `cgqlJWT`
      ),

      refreshToken: await jwt.sign(
        {
          id,
          email,
          exp: Math.floor(Date.now() / 1000) + 7 * (24 * 60 * 60), // Expires: Now + 7d
        },
        `cgqlJWT`
      ),
    };

    return userToken;
  },
};

export default SignUp;

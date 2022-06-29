import jwt from "@tsndr/cloudflare-worker-jwt";
import { AuthenticationError } from "apollo-server-cloudflare";
import bcrypt from "bcryptjs";
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
    try {
      // validate email and password
      if (!args.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        throw new Error("Invalid Email Address");
      if (
        !args.password.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
      )
        throw new Error(
          "Password must contain at least one uppercase, one lowercase, one number and one special character"
        );

      const payload = {
        name: args.name,
        email: args.email.toLowerCase(),
        password: await bcrypt.hash(args.password, 8),
      };
      const { data: newUser, error } = await pgClient
        .from("Users")
        .insert(payload)
        .single();

      if (error) throw new Error("Email already exists. Please sign in.");

      const userToken = {
        accessToken:
          "Bearer " +
          (await jwt.sign(
            {
              id: newUser.id,
              name: newUser.name,
              exp: Math.floor(Date.now() / 1000) + 12 * (60 * 60), // Expires: Now + 12h
            },
            SECRET
          )),

        refreshToken:
          "Bearer " +
          (await jwt.sign(
            {
              id: newUser.id,
              email: newUser.email,
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

export default SignUp;

import jwt from '@tsndr/cloudflare-worker-jwt';
import { AuthenticationError } from 'apollo-server-cloudflare';
import { GraphQLString } from "graphql";
import pgClient from '../../../utils/pgClient';
import TokenType from '../../TypeDefs/TokenType';

const SignIn = {
    type: TokenType,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent, args) {
        const { data: user, error } = await pgClient
            .from('users')
            .select("*")
            .eq('email', args.email.toLowerCase())
            .single();

        if (error) throw new AuthenticationError("No user associated with this email. Please sign up.");

        if (user && user.password === args.password) {
            const { name, email, password } = user;

            const userToken = {
                accessToken: await jwt.sign({
                    name,
                    exp: Math.floor(Date.now() / 1000) + (12 * (60 * 60)) // Expires: Now + 12h
                }, `cgqlJWT${password}`),

                refreshToken: await jwt.sign({
                    email,
                    exp: Math.floor(Date.now() / 1000) + (7 * (24 * 60 * 60)) // Expires: Now + 7d
                }, `cgqlJWT${password}`)
            }

            return userToken;
        }
        else {
            throw new AuthenticationError("Incorrect password. Please Try Again!");
        }
    }
}

export default SignIn;
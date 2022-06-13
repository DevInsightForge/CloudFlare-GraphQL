import jwt from '@tsndr/cloudflare-worker-jwt';
import { AuthenticationError } from 'apollo-server-cloudflare';
import { GraphQLString } from "graphql";
import pgClient from '../../../utils/pgClient';
import TokenType from '../../TypeDefs/TokenType';

const RefreshJWT = {
    type: TokenType,
    args: {
        refreshToken: { type: GraphQLString }
    },
    async resolve(parent, args) {
        const { payload } = jwt.decode(args.refreshToken);
        if (!payload.email) throw new AuthenticationError("Invalid token. Please try again.");

        const { data: user, error } = await pgClient
            .from('users')
            .select("*")
            .eq('email', payload.email.toLowerCase())
            .single();
        if (error) throw new AuthenticationError("No user associated with this token. Please sign up.");

        const isValid = await jwt.verify(args.refreshToken, `cgqlJWT${user.password}`);
        if (!isValid) throw new AuthenticationError("Provided token is either expired or invalid.");

        const userToken = {
            accessToken: await jwt.sign({
                name: user.name,
                exp: Math.floor(Date.now() / 1000) + (12 * (60 * 60)) // Expires: Now + 12h
            }, `cgqlJWT${user.password}`),
            refreshToken: args.refreshToken
        }

        return userToken;
    }
}

export default RefreshJWT;
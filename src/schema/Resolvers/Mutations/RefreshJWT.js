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
    async resolve(parent, { refreshToken }) {
        if (!refreshToken) throw new AuthenticationError("No refresh token provided");

        const isValid = await jwt.verify(refreshToken, `cgqlJWT`);
        const { payload } = jwt.decode(refreshToken);
        if (!isValid || !payload.email) throw new AuthenticationError("Provided token is either expired or invalid.");

        const { data: { id, name }, error } = await pgClient
            .from('users')
            .select("*")
            .eq('email', payload.email.toLowerCase())
            .single();
        if (error) throw new AuthenticationError("No user associated with this token. Please sign up.");

        const userToken = {
            accessToken: await jwt.sign({
                id,
                name,
                exp: Math.floor(Date.now() / 1000) + (12 * (60 * 60)) // Expires: Now + 12h
            }, `cgqlJWT`),
            refreshToken
        }

        return userToken;
    }
}

export default RefreshJWT;
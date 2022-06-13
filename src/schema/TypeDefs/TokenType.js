import { GraphQLObjectType, GraphQLString } from 'graphql';

const TokenType = new GraphQLObjectType({
    name: 'Token',
    fields: {
        accessToken: { type: GraphQLString },
        refreshToken: { type: GraphQLString },
    }
});

export default TokenType;
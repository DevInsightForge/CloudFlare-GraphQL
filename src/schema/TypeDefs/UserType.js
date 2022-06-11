// import createType from 'mongoose-schema-to-graphql';
import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    }
});

export default UserType;
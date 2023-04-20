const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} = require("graphql");

const { UserQuery, UserMutation } = require("./types/UserType");
const { PostQuery, PostMutation } = require("./types/PostType");
const { CommentQuery, CommentMutation } = require("./types/CommentType");

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    ...UserQuery,
    ...PostQuery,
    ...CommentQuery,
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    ...UserMutation,
    ...PostMutation,
    ...CommentMutation,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = schema;

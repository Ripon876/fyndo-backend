const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} = require("graphql");

const { UserQuery, UserMutation } = require("./types/UserType");
const { PostQuery, PostMutation } = require("./types/PostType");
const { CommentQuery, CommentMutation } = require("./types/CommentType");
const { MessageQuery, MessageMutation } = require("./types/MessageType");
const {
  ConversationQuery,
  ConversationMutation,
} = require("./types/ConversationType");

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    ...UserQuery,
    ...PostQuery,
    ...CommentQuery,
    ...MessageQuery,
    ...ConversationQuery,
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    ...UserMutation,
    ...PostMutation,
    ...CommentMutation,
    ...MessageMutation,
    ...ConversationMutation,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = schema;

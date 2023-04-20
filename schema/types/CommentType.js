const {
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
} = require("graphql");

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => {
    const { PostType } = require("./PostType");
    const { UserType } = require("./UserType");

    return {
      id: { type: GraphQLID },
      content: { type: GraphQLString },
      post: { type: PostType },
      creator: { type: UserType },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
    };
  },
});

const CommentQuery = {
  comments: {
    type: new GraphQLList(CommentType),
    resolve: () => {},
  },
  comment: {
    type: CommentType,
    args: {
      id: { type: GraphQLID },
    },
    resolve: () => {},
  },
};

const CommentMutation = {
  createComment: {
    type: CommentType,
    resolve: () => {},
  },
  updateComment: {
    type: CommentType,
    args: {
      id: { type: GraphQLID },
      content: { type: GraphQLString },
    },
    resolve: () => {},
  },
  deleteComment: {
    type: GraphQLBoolean,
    args: {
      id: { type: GraphQLID },
    },
    resolve: () => {},
  },
};

module.exports = {
  CommentType,
  CommentQuery,
  CommentMutation,
};

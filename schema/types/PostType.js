const {
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
} = require("graphql");

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => {
    const { UserType } = require("./UserType");

    return {
      id: { type: GraphQLID },
      content: { type: GraphQLString },
      media: { type: new GraphQLList(GraphQLString) },
      comments: { type: new GraphQLList(GraphQLString) },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
      creator: { type: UserType },
    };
  },
});

const PostQuery = {
  posts: {
    type: new GraphQLList(PostType),
    resolve: () => {},
  },
  post: {
    type: PostType,
    args: {
      id: { type: GraphQLID },
    },
    resolve: () => {},
  },
};

const PostMutation = {
  createPost: {
    type: PostType,
    resolve: () => {},
  },
  updatePost: {
    type: PostType,
    args: {
      id: { type: GraphQLID },
      content: { type: GraphQLString },
      media: { type: new GraphQLList(GraphQLString) },
    },
    resolve: () => {},
  },
  deletePost: {
    type: GraphQLBoolean,
    args: {
      id: { type: GraphQLID },
    },
    resolve: () => {},
  },
};

module.exports = {
  PostType,
  PostQuery,
  PostMutation,
};

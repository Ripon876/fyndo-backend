const {
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
} = require("graphql");
const {
  CreatePost,
  GetCreator,
  GetPosts,
  GetPost,
  UpdatePost,
  DeletePost,
} = require("../resolvers/postResolvers");

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
      creator: {
        type: UserType,
        resolve: GetCreator,
      },
    };
  },
});

const PostQuery = {
  posts: {
    type: new GraphQLList(PostType),
    resolve: GetPosts,
  },
  post: {
    type: PostType,
    args: {
      id: { type: GraphQLID },
    },
    resolve: GetPost,
  },
};

const PostMutation = {
  createPost: {
    type: PostType,
    args: {
      content: { type: GraphQLString },
    },
    resolve: CreatePost,
  },
  updatePost: {
    type: PostType,
    args: {
      id: { type: GraphQLID },
      content: { type: GraphQLString },
      media: { type: new GraphQLList(GraphQLString) },
    },
    resolve: UpdatePost,
  },
  deletePost: {
    type: GraphQLBoolean,
    args: {
      id: { type: GraphQLID },
    },
    resolve: DeletePost,
  },
};

module.exports = {
  PostType,
  PostQuery,
  PostMutation,
};

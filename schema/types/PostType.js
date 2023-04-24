const {
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
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

const PostsResultType = new GraphQLObjectType({
  name: "PostsReseult",
  fields: {
    total: { type: GraphQLInt },
    posts: { type: new GraphQLList(PostType) },
  },
});

const PostQuery = {
  getPosts: {
    type: PostsResultType,
    args: {
      page: { type: GraphQLInt },
      limit: { type: GraphQLInt },
    },
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

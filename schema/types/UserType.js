const {
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => {
    const { PostType } = require("./PostType");
    return {
      id: { type: GraphQLID },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      username: { type: GraphQLString },
      email: { type: GraphQLString },
      bio: { type: GraphQLString },
      profilePhoto: { type: GraphQLString },
      coverPhoto: { type: GraphQLString },
      friends: {
        type: new GraphQLList(UserType),
        resolve: () => {},
      },
      blocked: {
        type: new GraphQLList(UserType),
        resolve: () => {},
      },
      conversations: {
        type: new GraphQLList(GraphQLString),
        resolve: () => {},
      },
      posts: {
        type: new GraphQLList(PostType),
        resolve: () => {},
      },
    };
  },
});

const UserQuery = {
  users: {
    type: new GraphQLList(UserType),
    resolve: () => {},
  },
  user: {
    type: UserType,
    args: { id: { type: GraphQLID } },
    resolve: () => {},
  },
};

const UserMutation = {
  updateUser: {
    type: UserType,
    args: {
      id: { type: GraphQLID },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      email: { type: GraphQLString },
      bio: { type: GraphQLString },
    },
    resolve: () => {},
  },
  deleteUser: {
    type: GraphQLBoolean,
    args: {
      id: { type: GraphQLID },
    },
    resolve: () => {},
  },
};

module.exports = {
  UserType,
  UserQuery,
  UserMutation,
};

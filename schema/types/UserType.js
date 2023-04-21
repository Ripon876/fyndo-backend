const {
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");
const {
  GetUsers,
  GetFriends,
  GetUser,
  UpdateUser,
} = require("../resolvers/userResolvers");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => {
    const { PostType } = require("./PostType");
    return {
      id: { type: GraphQLID },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      username: { type: GraphQLString },
      bio: { type: GraphQLString },
      email: { type: GraphQLString },
      phone: { type: GraphQLString },
      phone: { type: GraphQLString },
      address: { type: GraphQLString },
      profilePhoto: { type: GraphQLString },
      coverPhoto: { type: GraphQLString },
      friends: {
        type: new GraphQLList(UserType),
        resolve: GetFriends,
      },
      requestsReceived: {
        type: new GraphQLList(UserType),
        resolve: () => {},
      },
      requestsSent: {
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
    resolve: GetUsers,
  },
  user: {
    type: UserType,
    args: { id: { type: GraphQLID } },
    resolve: GetUser,
  },
};

const UserMutation = {
  updateUser: {
    type: UserType,
    // args: {
    //   id: { type: GraphQLID },
    //   firstName: { type: GraphQLString },
    //   lastName: { type: GraphQLString },
    //   email: { type: GraphQLString },
    //   bio: { type: GraphQLString },
    // },
    resolve: UpdateUser,
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

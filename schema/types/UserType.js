const {
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInputObjectType,
} = require("graphql");
const {
  GetUsers,
  GetFriends,
  GetUser,
  UpdateUser,
  GetEducation,
  GetUserPosts,
  AddFriend,
  FriendshipStatus,
  AcceptRequest,
} = require("../resolvers/userResolvers");

const E = new GraphQLObjectType({
  name: "E",
  fields: {
    name: { type: GraphQLString },
    status: { type: GraphQLString },
  },
});

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
      education: {
        type: new GraphQLList(E),
        resolve: GetEducation,
      },
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
        resolve: GetUserPosts,
      },
    };
  },
});

const FriendshipStatusType = new GraphQLObjectType({
  name: "FriendshipStatus",
  fields: {
    id: { type: GraphQLID },
    status: { type: GraphQLString },
    sender: { type: GraphQLID },
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
  friendshipStatus: {
    type: FriendshipStatusType,
    args: { id: { type: GraphQLID } },
    resolve: FriendshipStatus,
  },
};

const UserMutation = {
  updateUser: {
    type: UserType,
    args: {
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      email: { type: GraphQLString },
      bio: { type: GraphQLString },
      phone: { type: GraphQLString },
      address: { type: GraphQLString },
      education: { type: GraphQLString },
    },
    resolve: UpdateUser,
  },
  deleteUser: {
    type: GraphQLBoolean,
    args: {
      id: { type: GraphQLID },
    },
    resolve: () => {},
  },
  addFriend: {
    type: GraphQLString,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: AddFriend,
  },
  acceptRequest: {
    type: GraphQLBoolean,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: AcceptRequest,
  },
};

module.exports = {
  UserType,
  UserQuery,
  UserMutation,
};

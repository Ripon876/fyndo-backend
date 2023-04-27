const {
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInputObjectType,
} = require("graphql");

const MessageType = new GraphQLObjectType({
  name: "Message",
  fields: () => {
    const { UserType } = require("./UserType");
    const { ConversationType } = require("./ConversationType");

    return {
      id: { type: GraphQLID },
      sender: {
        type: UserType,
        resolve: () => {},
      },
      receiver: {
        type: UserType,
        resolve: () => {},
      },
      conversation: {
        type: ConversationType,
        resolve: () => {},
      },
      message: {
        type: GraphQLString,
      },
      sentAt: {
        type: GraphQLString,
      },
    };
  },
});

const MessageQuery = {
  messeges: {
    type: new GraphQLList(MessageType),
    args: {
      id: { type: GraphQLID },
    },
    resolve: () => {},
  },
};

const MessageMutation = {
  createMessage: {
    type: MessageType,
    args: {
      sender: { type: GraphQLID },
      reciver: { type: GraphQLID },
      conversation: { type: GraphQLID },
      messege: { type: GraphQLString },
    },
    resolve: () => {},
  },
  deleteMessage: {
    type: GraphQLBoolean,
    args: {
      id: { type: GraphQLID },
    },
    resolve: () => {},
  },
};

module.exports = {
  MessageType,
  MessageQuery,
  MessageMutation,
};

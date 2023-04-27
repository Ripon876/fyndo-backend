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
  CreateMesssage,
  GetMessages,
  GetSender,
  GetReceiver,
  GetConversation,
} = require("../resolvers/messageResolver");

const MessageType = new GraphQLObjectType({
  name: "Message",
  fields: () => {
    const { UserType } = require("./UserType");
    const { ConversationType } = require("./ConversationType");

    return {
      id: { type: GraphQLID },
      sender: {
        type: UserType,
        resolve: GetSender,
      },
      receiver: {
        type: UserType,
        resolve: GetReceiver,
      },
      conversation: {
        type: ConversationType,
        resolve: GetConversation,
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
  getMesseges: {
    type: new GraphQLList(MessageType),
    args: {
      id: { type: GraphQLID },
    },
    resolve: GetMessages,
  },
};

const MessageMutation = {
  createMessage: {
    type: MessageType,
    args: {
      receiver: { type: GraphQLID },
      conversation: { type: GraphQLID },
      message: { type: GraphQLString },
    },
    resolve: CreateMesssage,
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

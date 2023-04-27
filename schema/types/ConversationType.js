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
  GetConversation,
  GetConversations,
} = require("../resolvers/conversationResolvers");

const ConversationType = new GraphQLObjectType({
  name: "Conversation",
  fields: () => {
    const { UserType } = require("./UserType");
    const { MessageType } = require("./MessageType");

    return {
      id: { type: GraphQLID },
      participants: {
        type: new GraphQLList(UserType),
      },
      lastMessage: {
        type: MessageType,
      },
      createdAt: {
        type: GraphQLString,
      },
    };
  },
});

const ConversationQuery = {
  getConversations: {
    type: new GraphQLList(ConversationType),
    resolve: GetConversations,
  },
};

const ConversationMutation = {
  getConversation: {
    type: ConversationType,
    args: {
      participant: {
        type: GraphQLID,
      },
    },
    resolve: GetConversation,
  },
  deleteConversation: {
    type: GraphQLBoolean,
    args: {
      id: { type: GraphQLID },
    },
    resolve: () => {},
  },
};

module.exports = {
  ConversationType,
  ConversationQuery,
  ConversationMutation,
};

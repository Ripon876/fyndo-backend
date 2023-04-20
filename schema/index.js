const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} = require("graphql");

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    users: {
      type: new GraphQLList(GraphQLString),
      resolve: async () => {
        return ["string 1", "string 2", "string 2"];
      },
    },
  }),
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: () => ({
    addUser: {
      type: GraphQLString,
      args: {
        name: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        return [args.name];
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = schema;

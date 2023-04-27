const { session } = require("neo4j-driver");
const { nanoid } = require("nanoid");
const driver = require("../../database");

exports.GetConversation = async (_, args, ctx) => {
  const session = driver.session();
  try {
    const createdAt = new Date().toISOString();
    const result = await session.run(
      `
      MATCH (u1:User {id: "${ctx.req.user.id}"}),(u2:User {id: "${
        args.participant
      }"})
      MERGE (u1) <-[:Participant]- (c:Conversation)-[:Participant]->(u2)
      ON CREATE SET c.createdAt = "${createdAt}", c.id = "${nanoid()}"
      RETURN c, collect(u2) AS participants
      `
    );
    const converation = {
      ...result.records[0].get("c").properties,
      participants: result.records[0]
        .get("participants")
        .map((node) => node.properties),
    };
    return converation;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};

exports.GetConversations = async (_, __, ctx) => {
  const session = driver.session();
  try {
    const createdAt = new Date().toISOString();
    const result = await session.run(
      `
      MATCH (:User{id: "${ctx.req.user.id}"}) <-[:Participant]- (c:Conversation)-[:Participant]->(u:User)
      RETURN c, collect(u) AS participants
      `
    );

    const converations = result.records.map((record) => {
      return {
        ...record.get("c").properties,
        participants: record.get("participants").map((node) => node.properties),
      };
    });

    return converations;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};

const { session } = require("neo4j-driver");
const { nanoid } = require("nanoid");
const driver = require("../../database");

exports.GetMessages = async (_, args) => {
  const session = driver.session();
  try {
    const { id } = args;
    const result = await session.run(`
        MATCH (m:Message) - [:BelongsTo] -> (c:Conversation {id: "${id}"})
        WITH m ORDER BY m.sentAt ASC
        RETURN collect(properties(m)) AS messages

   `);
    const messages = result.records[0].get("messages");
    return messages;
  } catch (err) {
    console.log(err);
    return [];
  } finally {
    await session.close();
  }
};

exports.GetSender = async (message) => {
  const session = driver.session();
  try {
    const { id } = message;
    const result = await session.run(`
          MATCH (:Message {id: "${id}"}) - [:Sender] -> (u:User)
          RETURN properties(u) As sender
     `);
    const sender = result.records[0].get("sender");

    return sender;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};

exports.GetReceiver = async (message) => {
  const session = driver.session();
  try {
    const { id } = message;
    const result = await session.run(`
          MATCH (:Message {id: "${id}"}) - [:Receiver] -> (u:User)
          RETURN properties(u) As receiver
     `);
    const receiver = result.records[0].get("receiver");

    return receiver;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};
exports.GetConversation = async (message) => {
  const session = driver.session();
  try {
    const { id } = message;
    const result = await session.run(`
    MATCH (:Message {id: "${id}"}) - [:BelongsTo] -> (c:Conversation)
          RETURN properties(c) As conversation
     `);
    const conversation = result.records[0].get("conversation");

    return conversation;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};

exports.CreateMesssage = async (_, args, ctx) => {
  const session = driver.session();
  try {
    const { receiver, conversation, message } = args;
    const sender = ctx.req.user.id;
    const id = nanoid();
    const sentAt = new Date().toISOString();
    const result = await session.run(`
        MATCH (s:User {id: "${sender}"}),(r:User {id: "${receiver}"}), (c:Conversation {id: "${conversation}"})
        OPTIONAL MATCH (c) - [lm:LastMessage] -> (:Message)
        WHERE lm IS NOT NULL 
        DELETE lm
        CREATE (m:Message {id: "${id}",message:"${message}",sentAt: "${sentAt}"}) - [:BelongsTo] -> (c)
        CREATE (s) <- [:Sender] - (m) -[:Receiver]-> (r)
        CREATE (c) - [:LastMessage] -> (m)
        RETURN m{.*,sender: properties(s),receiver: properties(r),conversation: properties(c)} AS message
    `);
    const msg = result.records[0].get("message");


    return msg;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};

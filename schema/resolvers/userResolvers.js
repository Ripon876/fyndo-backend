const driver = require("../../database");
const { nanoid } = require("nanoid");

exports.GetUsers = async () => {
  const session = driver.session();
  try {
    const result = await session.run(
      `
    MATCH (u:User)
    RETURN u
    `
    );
    if (result.records.length === 0) return [];
    const users = result.records.map((record) => record.get("u").properties);
    return users;
  } catch (err) {
    console.log(err);
    return [];
  } finally {
    await session.close();
  }
};

exports.GetUser = async (_, args, ctx) => {
  const session = driver.session();
  try {
    const id = args.id || ctx.req.user.id;
    const result = await session.run(
      `
    MATCH (u:User {id: "${id}"})
    RETURN u
    `
    );
    if (result.records.length === 0) return [];
    const user = result.records[0].get("u").properties;
    return user;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};

exports.UpdateUser = async (__, { ...args }, ctx) => {
  const session = driver.session();
  try {
    const id = ctx.req.user.id;

    const data = args;
    const result = await session.run(
      `
    MATCH (u:User {id: "${id}"})
    SET u+=$data
    RETURN u
    `,
      { data }
    );
    if (result.records.length === 0) return [];
    const user = result.records[0].get("u").properties;
    return user;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};

exports.GetEducation = async (user) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `
    MATCH (u:User {id: "${user.id}"}) 
    RETURN u
    `
    );

    if (result.records.length === 0) return [];
    const education = result.records[0].get("u").properties.education;
    return JSON.parse(education);
  } catch (err) {
    console.log(err);
    return [];
  } finally {
    await session.close();
  }
};
exports.GetFriends = async (user) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `
    MATCH (:User {id: "${user.id}"}) - [:FriendWith] - (f:User)
    RETURN f
    `
    );

    if (result.records.length === 0) return [];
    const friends = result.records.map((record) => record.get("f").properties);
    return friends;
  } catch (err) {
    console.log(err);
    return [];
  } finally {
    await session.close();
  }
};

exports.GetUserPosts = async (user) => {
  const session = driver.session();
  try {
    const result = await session.run(
      ` MATCH (u:User {id: "${user.id}"}) - [:Posted] -> (p:Post)
        RETURN u,p
        ORDER BY p.createdAt DESC
      `
    );

    if (result.records.length === 0) return [];
    const posts = result.records.map((record) => {
      const post = record.get("p").properties;
      post.creator = record.get("u");
      return post;
    });

    return posts;
  } catch (err) {
    console.log(err);
    return [];
  } finally {
    await session.close();
  }
};

exports.FriendshipStatus = async (_, args, ctx) => {
  const session = driver.session();
  try {
    const friendId = args.id;
    const userId = ctx.req.user.id;

    const result = await session.run(
      ` MATCH (u:User {id: "${userId}"}) -[r:FriendWith] - (f:User {id: "${friendId}"})  
        RETURN r.status AS status,r.sender AS sender,r.id AS id
      `
    );

    if (result.records.length === 0) return null;
    const friendshipStatus = {
      status: result.records[0].get("status"),
      sender: result.records[0].get("sender"),
      id: result.records[0].get("id"),
    };

    return friendshipStatus;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};

exports.AddFriend = async (_, args, ctx) => {
  const session = driver.session();
  try {
    const senderId = ctx.req.user.id;
    const recieverId = args.id;
    const requestId = nanoid();
    const requestedAt = new Date().toUTCString();

    const result = await session.run(
      ` MATCH (s:User {id: "${senderId}"}), (r:User {id: "${recieverId}"})  
        OPTIONAL MATCH (s)  - [rl:FriendWith]- (r)
        WITH s,r,rl
        FOREACH (x IN CASE WHEN rl IS NOT NULL THEN [1] ELSE [] END |
            DELETE rl
           
        )
        FOREACH (y IN CASE WHEN rl IS NULL THEN [1] ELSE [] END |
            CREATE (s) -[:FriendWith { id : "${requestId}" , sender: "${senderId}",requestedAt: "${requestedAt}", status: "pending"}] -> (r)
        )
        RETURN CASE
                WHEN rl  IS NOT NULL THEN "Add Friend"
                ELSE "Cancel Request"
               END AS message
      `
    );

    if (result.records.length === 0) return null;

    const message = result.records[0].get("message");

    return message;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};

exports.AcceptRequest = async (_, args) => {
  const session = driver.session();
  try {
    const requestId = args.id;
    const acceptedAt = new Date().toUTCString();
    const result = await session.run(
      ` MATCH (:User  ) - [rl:FriendWith {id: "${requestId}"}] - (:User)  
        SET rl.status =  "accepted"
        SET rl.acceptedAt = "${acceptedAt}"
        RETURN true AS success
      `
    );

    if (result.records.length === 0) return null;

    const success = result.records[0].get("success");

    return success || true;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};

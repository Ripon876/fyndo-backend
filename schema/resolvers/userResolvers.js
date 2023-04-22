const driver = require("../../database");

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

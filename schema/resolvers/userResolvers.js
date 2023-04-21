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
    const id = ctx.req.user.id;
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
    console.log(args);
    return;
    const result = await session.run(
      `
    MATCH (u:User {id: "${id}"})
    SET u+=$data
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

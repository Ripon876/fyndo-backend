const driver = require("../../database");
const { nanoid } = require("nanoid");
const { CreateType } = require("../../utils/createType");

exports.CreatePost = async (_, args, ctx) => {
  const session = driver.session();

  try {
    const data = args;
    data.id = nanoid();
    data.createdAt = new Date().toUTCString();
    data.updatedAt = new Date().toUTCString();

    const props = Object.keys(data)
      .map((key) => `${key} : ${"$" + key}`)
      .join(",");

    const result = await session.run(
      ` MATCH (u:User {id: "${ctx.req.user.id}"})
        WITH u
        CREATE (p:Post {${props}})
        CREATE (u) - [:Posted] -> (p)
        RETURN u,p
       `,
      data
    );

    if (result.records.length === 0) {
      return null;
    } else {
      const post = result.records[0].get("p").properties;
      post.creator = result.records[0].get("u").properties;
      return post;
    }
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};

exports.GetCreator = async (post) => {
  const session = driver.session();

  try {
    const result = await session.run(
      ` MATCH (u:User) - [:Posted] -> (:Post {id: "${post.id}"})
        RETURN u
    `
    );

    if (result.records.length === 0) {
      return null;
    } else {
      const creator = result.records[0].get("u").properties;
      return creator;
    }
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    await session.close();
  }
};

exports.GetPosts = async () => {
  const session = driver.session();

  try {
    const result = await session.run(
      ` MATCH (u:User) - [:Posted] -> (p:Post)
        RETURN u,p
    `
    );

    if (result.records.length === 0) {
      return [];
    } else {
      const posts = result.records.map((record) => {
        const post = record.get("p").properties;
        post.creator = record.get("u");
        return post;
      });

      return posts;
    }
  } catch (err) {
    console.log(err);
    return [];
  } finally {
    await session.close();
  }
};

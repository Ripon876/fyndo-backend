exports.CheckUsername = async (username, driver) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `
        MATCH (u:User {username: "${username}"})
        RETURN u
        `
    );

    if (result.records.length === 0) {
      return false;
    } else {
      return result.records[0].get("u").properties;
    }
  } catch {
    return false;
  } finally {
    await session.close();
  }
};

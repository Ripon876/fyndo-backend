const { nanoid } = require("nanoid");

exports.CreateType = async (data, type, driver) => {
  const session = driver.session();
  try {
    data.id = nanoid();
    const props = Object.keys(data)
      .map((key) => `${key} : ${"$" + key}`)
      .join(",");
    console.log(props);
    const result = await session.run(
      `
        CREATE (v:${type} {${props}})
        RETURN v
        `,
      data
    );

    if (result.records.length === 0) {
      return null;
    } else {
      return result.records[0].get("v").properties;
    }
  } catch {
    return null;
  } finally {
    await session.close();
  }
};

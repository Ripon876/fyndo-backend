const driver = require("../database");
const { UploadImage } = require("../utils/UploadImg");

exports.GetUserDetails = async (req, res) => {
  const session = require();
  try {
  } catch (err) {}
};

exports.UpdatePhoto = async (req, res) => {
  const session = driver.session();
  try {
    const imgurl = await UploadImage(req.files.file);

    const update = {
      [req.body.type]: imgurl,
    };
    const result = await session.run(
      `
        MATCH (u:User {id: "${req.user.id}"})
        SET u+=$update
        RETURN u
        `,
      { update }
    );

    if (result.records.length === 0) {
      res.status(501).json({
        success: false,
        message: "Something went wrong",
      });
    } else {
      res.json({
        success: true,
        message: req.body.type + " updated successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      msg: "something went wrong",
    });
  } finally {
    session.close();
  }
};

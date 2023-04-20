const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const driver = require("../database");
const { CreateType } = require("../utils/createType");
const { CheckUsername } = require("../helpers/checkUsername");

exports.SignUpUser = async (req, res) => {
  if (Object.values(req.body).length === 0) {
    res.json({
      success: false,
      message: "usermame & password missing",
    });
    return;
  }

  const session = driver.session();
  try {
    const data = req.body;
    const userExist = await CheckUsername(data.username, driver);
    if (!userExist) {
      const pwd = await bcrypt.hash(data.password, 10);
      data.password = pwd;
      const user = await CreateType(data, "User", driver);
      if (user) {
        res.json({
          success: true,
          data: user,
        });
      }
    } else {
      res.json({
        success: false,
        message: "Username already exists",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(501).json({
      success: false,
      message: "Something went wrong",
    });
  } finally {
    await session.close();
  }
};

exports.LoginUser = async (req, res) => {
  if (Object.values(req.body).length === 0) {
    res.json({
      success: false,
      message: "Credentials missing",
    });
    return;
  }

  const session = driver.session();

  try {
    const data = req.body;
    const user = await CheckUsername(data.username, driver);
    if (!user) {
      res.status(501).json({
        success: false,
        message: "invalid username",
      });
    } else {
      const matched = await bcrypt.compare(data.password, user.password);

      if (!matched) {
        res.status(501).json({
          success: false,
          message: "invalid password",
        });
      } else {
        const token = await jwt.sign(
          {
            id: user.id,
            username: user.username,
          },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );

        res.json({
          success: true,
          message: "Login successful",
          token,
        });
      }
    }
  } catch (err) {
    res.status(501).json({
      success: false,
      message: "something went wrong",
    });
  } finally {
    session.close();
  }
};

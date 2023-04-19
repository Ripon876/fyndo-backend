var User = require("../models/user");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

exports.SignUpUser = async (req, res) => {
  if (req.body) {
    var oldUser = await User.find({ username: req.body.username });
    if (oldUser.length === 0) {
      try {
        var pwd = await bcrypt.hash(req.body.password, 10);
        var user = new User({
          username: req.body.username,
          password: pwd,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          contacts: {
            phone_num: "",
            email: "",
            address: "",
          },
        });
        // console.log(user);
        await user.save();
        res.status(200).json({
          status: true,
          msg: "signup successful",
        });
      } catch (err) {
        console.log(err);
        res.status(501).json({
          err: "signup failed",
        });
      }
    } else {
      res.status(406).json({
        err: "user with the username already exits",
      });
    }
  } else {
    res.status(406).json({
      err: "signup details not found",
    });
  }
};

exports.LoginUser = async (req, res) => {
  if (req.body) {
    try {
      console.log(req.body);
      var user = await User.find({ username: req.body.username });
      if (user && user.length > 0) {
        var isPwdValid = await bcrypt.compare(
          req.body.password,
          user[0].password
        );
        console.log(isPwdValid);
        if (isPwdValid) {
          var token = await jwt.sign(
            {
              name: user[0].first_name + " " + user[0].last_name,
              username: user[0].username,
              id: user[0]._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
          );

          res.status(200).json({
            token: token,
            msg: "login successful",
          });
        }
      } else {
        res.status(401).json({
          msg: "authentication failed",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        msg: "authentication failed",
      });
    }
  } else {
    res.status(401).json({
      msg: "username and password is required",
    });
  }
};

exports.LogOutUser = async (req, res) => {
  res.clearCookie("refreshtoken");

  res.status(200).json({
    msg: "logout successful",
  });
};

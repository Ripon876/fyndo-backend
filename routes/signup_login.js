var express = require("express");
var router = express.Router();

const {
  SignUpUser,
  LoginUser,
  LogOutUser,
} = require("../controllers/AuthController");

router.post("/signup", SignUpUser);
router.post("/login", LoginUser);
router.get("/logout", LogOutUser);

module.exports = router;

var express = require("express");
var router = express.Router();

const { SignUpUser, LoginUser } = require("../controllers/AuthController");

router.post("/signup", SignUpUser);
router.post("/login", LoginUser);

module.exports = router;

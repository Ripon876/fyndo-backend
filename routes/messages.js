const express = require("express");
const router = express.Router();

const { GetThread, GetFriends } = require("../controllers/messageController");

router.get("/friends", GetFriends);
router.post("/thread", GetThread);

module.exports = router;

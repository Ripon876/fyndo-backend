const express = require("express");
const router = express.Router();

const { UpdatePhoto } = require("../controllers/profileController");
const { authCheck } = require("../middlewares/authCheck");

router.get("/user-details");
router.post("/updatePhoto", authCheck, UpdatePhoto);

module.exports = router;

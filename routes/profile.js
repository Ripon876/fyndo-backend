const express = require('express');
const router = express.Router();

const {UpdatePhoto} = require("../controllers/profileController");

router.get("/user-details",)
router.post('/updatePhoto',UpdatePhoto);

module.exports = router;
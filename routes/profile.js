const express = require('express');
const router = express.Router();

const {UpdatePhoto} = require("../controllers/profileController");

router.post('/updatePhoto',UpdatePhoto);

module.exports = router;
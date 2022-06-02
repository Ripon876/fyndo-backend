var express = require("express");
var router = express.Router();
var User  = require('../models/user');


router.get('/login',(req,res) => {
	res.send("this is the login route");
})

module.exports = router;
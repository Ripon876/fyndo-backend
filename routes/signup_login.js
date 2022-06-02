var express = require("express");
var router = express.Router();
var User  = require('../models/user');
const bcrypt = require('bcrypt');




router.post('/signup',async(req,res)=> {



if(req.body){
	var oldUser = await User.find({username : req.body.username});


	if(!oldUser){

	try{

		var pwd = await bcrypt.hash(req.body.password,10);
		var user = new User({
			username :  req.body.username,
			password : pwd,
			first_name : req.body.first_name,
			last_name : req.body.last_name
		});
		// console.log(user);
		await user.save();
		res.status(200).json({
			'msg':  'signup successful'
		})

	}catch(err){

		console.log(err)
		res.status(500).json({
			'err':  'signup failed'
		})

	}
	}else{

		res.status(500).json({
			'err':  'user with the username already exits'
		})
	}
}


	
})












router.get('/login',(req,res) => {
	res.send("this is the login route");
})

module.exports = router;
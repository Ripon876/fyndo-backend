var express = require("express");
var router = express.Router();
var User  = require('../models/user');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


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


router.post('/login',async(req,res)=>{

	if(req.body){
		try{
	
			var user = await User.find({username : req.body.username});

			if(user && user.length > 0){
				var isPwdValid  = await bcrypt.compare(req.body.password,user[0].password);
			    
			    if(isPwdValid){
			     var token = await jwt.sign({username : user[0].username,id : user[0]._id},process.env.JWT_SECREAT_TOKEN,{ expiresIn: '1h' });
			    
			        res.status(200).json({
			        	'token' : token,
						'msg':  'login successful'
					})
			    
			    }
			}

		}catch(err){

			console.log(err)
			res.status(500).json({
				'err':  'authentication failed'
			})

		}




	}else{
		res.status(401).json({
			'err':  'username and password is required'
		})
	}
})






module.exports = router;
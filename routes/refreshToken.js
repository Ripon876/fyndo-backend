const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mongoose = require('mongoose');

router.get('/refreshtoken',async (req,res)=> {

if(req.signedCookies.refreshtoken){
	 const data = jwt.verify(req.signedCookies.refreshtoken, process.env.JWT_SECREAT_TOKEN_REF);


	const user  = await User.findOne({_id : data.id,username :  data.username})
	var authtoken;

	if(user){
	authtoken = await jwt.sign({username : user.username,id : user._id},process.env.JWT_SECREAT_TOKEN,{ expiresIn: '15m' });

	}

		res.status(200).json({status : true,token : authtoken});



}else{
		res.status(201).json({status : false ,'err':  'authentication failed'});
}






})




module.exports = router;



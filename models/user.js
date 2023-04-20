// var mongoose = require('mongoose');

// const educationSchema = new  mongoose.Schema({
// 	name : String,
// 	from : String,
// 	to: String

// })


// const userSchema = new mongoose.Schema({
// 	first_name : {type : String, required : 'first name is required'},
// 	last_name : String,
// 	username : {type : String, required : true},
// 	password : {type : String, required : true},
// 	bio : String,
// 	education : [],
// 	contacts : {
// 		phone_num : String,
// 		email : String,
// 		address : String
// 	},
// 	post : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
// 	threads : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
// 	status :  {type: Boolean, default : false},
// 	profile_photo : {type:  String, default : ''},
// 	cover_photo : {type:  String, default : ''}

// })


// const User = mongoose.model('user',userSchema);

// module.exports = User; 
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	from : {
		name :  String,
		id : String,
		username : String
	},
	to : {
		name :  String,
		id : String,
		username : String
	},
	type : String,
	msg : String
	
});


const Message = mongoose.model("Message",messageSchema);

module.exports = Message;

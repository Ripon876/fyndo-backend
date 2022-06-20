const mongoose = require('mongoose'); 


const threadSchema = new mongoose.Schema({
	  users :  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	  messages :  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

const Thread = mongoose.model("Thred",threadSchema);

module.exports = Thread;
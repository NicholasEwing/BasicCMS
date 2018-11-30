const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	blog: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog"
		}
	}
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
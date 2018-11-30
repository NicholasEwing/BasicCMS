const mongoose = require("mongoose");

// blog schema
const blogSchema = new mongoose.Schema({
	title: {type: String, unique: true},
	image: String,
	body: String,
	created: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
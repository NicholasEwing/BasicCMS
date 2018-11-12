const mongoose = require("mongoose");

// blog schema
let blogSchema = new mongoose.Schema({
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

// blogSchema.pre("remove", (next) => {
// 	this.model("Comment").remove({blog: this._id}, next);
// });

let Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
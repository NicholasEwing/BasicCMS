const mongoose = require("mongoose");

// blog schema
let blogSchema = new mongoose.Schema({
	title: {type: String, unique: true},
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

let Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// user schema
let userSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	isAdmin: {type: Boolean, default: true}
});

userSchema.plugin(passportLocalMongoose);

let User = mongoose.model("User", userSchema);

module.exports = User;
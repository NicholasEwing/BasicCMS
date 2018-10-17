const mongoose = require("mongoose");

// Models
let Blog = require("./models/blog");
let User = require("./models/user");
let Comment = require("./models/comment");

var blogData = [
	{ 
		title: "Blog Post #1",
		image: "https://images.unsplash.com/photo-1538936494148-deafc1519ded?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2189c8fcabcee117ecceee521e3f1e39&auto=format&fit=crop&w=1489&q=80",
		body: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
	},
	{ 
		title: "Blog Post #2",
		image: "https://images.unsplash.com/photo-1538922589039-098adae1692b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e0a4f7b1e775272dfb19087e50358883&auto=format&fit=crop&w=500&q=60",
		body: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
	},
	{ 
		title: "Blog Post #3",
		image: "https://images.unsplash.com/photo-1538898500942-78b80fa92216?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=47cb3d4ff0b30831ff124c1bd22b0a5e&auto=format&fit=crop&w=500&q=60",
		body: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
	}
];

var commentData = [
	{
		text: "People tell me I write great comments. Great. Ok. The best.",
		author: "AvidBlogUser93"
	},
	{
		text: "This blog post changed my life. Amazing.",
		author: "KeyboardWarrior82"
	},
	{
		text: "Just another comment. Don't mind me.",
		author: "Tanya Jones"
	}
];

// This function is prime callback hell, needs refactoring.
function seedDB(){

	// Remove all blogs
	Blog.deleteMany({}, function(err){
		if(err) {
			console.log(err)
		}

		console.log("removed blogs");

		// // Add new blogs
		// blogData.forEach(function(seed){
		// 	Blog.create(seed, function(err, blog){
		// 		if(err) {
		// 			console.log(err);
		// 		} else {
		// 			console.log("Added new blog");

		// 			// commentData.forEach(function(seed){
		// 			// 	Comment.create(seed, function(err, comment){
		// 			// 		if(err) {
		// 			// 			console.log(err);
		// 			// 		} else {
		// 			// 			blog.comments.push(comment);
		// 			// 			console.log("Created new comment");
		// 			// 		}
		// 			// 	});
		// 			// });
		// 			Comment.create(
		// 				{
		// 					text: "This is a GREAT blog post!",
		// 					author: "TestUser1234"
		// 				}, function(err, comment){
		// 					if (err){
		// 						console.log(err)
		// 					} else {
		// 						blog.comments.push(comment);
		// 						blog.save();
		// 						console.log("Created new comment!");
		// 					}
		// 				});
		// 		}
		// 	});
		// });
	});

}

module.exports = seedDB;
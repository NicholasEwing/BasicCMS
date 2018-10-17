# BasicCMS

In this project, I'm creating a basic content management system to polish my front-end and back-end skills.

For the first leg of the project, I'm using ONLY vanilla CSS3 to create a basic responsive layout. Once authentication features have been added, I'll rework the app's front-end using Angular and rework the back-end as necessary (consolidating into one index.html instead of ejs templates).

Although this isn't efficient for a "real" product, I'm doing this to get extra practice and improve my fundamental CSS3 skills before going back to frameworks like Angular, Bootstrap, Vue, and React.

Technologies used:
* HTML5
* CSS3
* JavaScript
* Node.js
* Express / EJS
* MongoDB / Mongoose
* Heroku

# TODO:
	* CLEAN UP:
		* make isLoggedIn / isAdmin DRY
		* refactor auth routes (DONE)
		* refactor index routes (DONE)
		* make logging in return user to previous page
		* put filler info in footer links
		* add favicon
		* cleanup section tags
	* AUTH:
		* associate comments with users (DONE)
		* have user page, shows all blogs they made
		* add permissions, "admin" for posting and "user" for viewing (DONE)
	* ERRORS:
		* add actual error handling!
		* create 404 page
	* SECURITY:
		* add helmet and follow other best practices
		* try to post from POSTMAN
		* sanitize comments, ensure line breaks work in comments
	* WISHLIST:
		* handle vertical images differently
		* handle profanity, inappropriate images, inappropriate names, etc
		* lint code
		* minify code
		* unit testing
		* ensure 100% test coverage
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
		* make isLoggedIn / isAdmin DRY (DONE)
		* refactor auth routes (DONE)
		* refactor index routes (DONE)
		* put filler info in footer links, make filler page (DONE)
		* make login / register views look better on mobile (DONE)
		* add password confirm on registration form (DONE)
		* add favicon (DONE)
		* cleanup section tags (DONE)
		* resize images (DONE)
	* FEATURE:
		* make logging in return user to previous page (DONE)
	* AUTH:
		* associate comments with users (DONE)
		* have user page, shows all blogs they made (DONE)
		* add permissions, "admin" for posting and "user" for viewing (DONE)
	* ERRORS:
		* add actual error handling! (DONE)
		* create 404 page (DONE)
	* SECURITY:
		* add helmet.js, check out other best practices
		* try to post from POSTMAN (DONE)
		* sanitize comments, ensure line breaks work in comments (DONE)
	* DEPLOYMENT:
		* Host app on Heroku before moving to Wishlist tasks
	* WISHLIST:
		* Look up how to rebase commits and do that instead to cut down on commit spam
		* handle profanity, inappropriate images, inappropriate names, etc
		* lint code
		* minify code
		* unit testing
		* ensure 100% test coverage (?)
		* Create admin panel to allow editing of admin permissions
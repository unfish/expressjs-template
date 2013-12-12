expressjs-template
==================

Node.js+Express+Mongoosejs Project Template, MVC

With the origin expressjs project template, it's not so pretty to work start. Actually, you only have one "Hello World" page, and nothing else.

If you want to write a REAL web site with database and user auth, there is so many works to do, and so many docs to read.

So I write this project (with whole one day). Here is a standard MVC structure, and mongoose db layer.

* It has a User model, with an auth route you can use anywhere.
* It has a Topic model, with ralation to User. And a Comment model, ralation to Topic and User.
* A new user register page, login page, cookie handler, auth and session handled.
* A topic list page, and full CRUD action.
* A File model process all file upload and download, use PLUpload for ajax upload, and save uploaded file to mongodb GridFS, not file system.
* Each controller process it's own model and route, you never need to change app.js.
* And, the page use simple bootstrap css, and ajax post and error handler.
* And you can see how to organize the views, and use param and "if" "for each" in jade template.

I think you can use this project to make your own real world.

BTW, all tips and error messages in project is Chinese, but I think it's OK.

I just start learn nodejs, so many thanks to:
    http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/
    http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/
    and of cause, the mongoose document. But not the expressjs document, it's useless. :(

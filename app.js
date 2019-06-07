const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const app = require('express')();
const http = require('http').Server(app);
const flash = require('express-flash-messages');
const session = require('express-session');

//database configurations
const env = process.env.NODE_ENV || 'development';
const config = require('./database/config')[env];
//port used
const port = 3000;

//get all routes
const routes = require('./routes/api');

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
app.use(flash());
app.use(session({ cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false}));
app.use('/', routes);


//app listener port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
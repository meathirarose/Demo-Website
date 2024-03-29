const express = require("express");
const user_route = express();
const session = require('express-session');

const config = require('../config/config');

// session
user_route.use(session({secret:config.sessionSecret}))

// middleware
const authentication = require('../middleware/userAuthentication');

// bodyparser
const bodyparser = require('body-parser');
user_route.use(bodyparser.json());
user_route.use(bodyparser.urlencoded({ extended: true }));


// view engine and view
user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

// controllers
const userController = require('../controllers/userController');

// registration
user_route.get('/signup', authentication.isLogout, userController.signupLoad);
user_route.post('/signup', userController.insertUser);

// login
user_route.get('/', authentication.isLogout, userController.loginLoad);
user_route.get('/login', authentication.isLogout, userController.loginLoad);

user_route.post('/login',userController.verifyLogin);

// home
user_route.get('/home', authentication.isLogin, userController.homeLoad);

// logout
user_route.get('/logout', authentication.isLogin, userController.userLogout);





module.exports = {
    user_route
}
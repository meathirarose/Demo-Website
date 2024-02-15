const express = require("express");
const user_route = express();
const session = require('express-session');

const config = require('../config/config');

user_route.use(session({secret:config.sessionSecret}))

const bodyparser = require('body-parser');
user_route.use(bodyparser.json());
user_route.use(bodyparser.urlencoded({ extended: true }));

user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

const userController = require('../controllers/userController');

// registration
user_route.get('/signup', userController.signupLoad);
user_route.post('/signup',userController.insertUser);

// login
user_route.get('/',userController.loginLoad);
user_route.get('/login',userController.loginLoad);

user_route.post('/login',userController.verifyLogin);

// dashboard
user_route.get('/home',userController.homeLoad);

module.exports = {
    user_route
}

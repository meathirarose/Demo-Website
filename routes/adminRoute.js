const express = require('express');
const admin_route = express();

const session = require('express-session');
const config = require('../config/config');
admin_route.use(session({secret:config.sessionSecret}));

// middleware
const adminAuthentication = require('../middleware/adminAuthentication');

// bodyparser
const bodyparser = require('body-parser');
admin_route.use(bodyparser.json());
admin_route.use(bodyparser.urlencoded({extended:true}));

// setting view engine and view
admin_route.set('view engine', 'ejs');
admin_route.set('views','./views/admin');

// access controller
const adminController = require('../controllers/adminController');

// admin login
admin_route.get('/', adminAuthentication.isAdminLogout ,adminController.adminLoad);
admin_route.get('/admin', adminAuthentication.isAdminLogout, adminController.adminLoad);

// admin login verification
admin_route.post('/',adminController.verifyAdminLogin);

// admin home
admin_route.get('/adminHome', adminAuthentication.isAdminLogin, adminController.loadDashboard);

// admin logout
admin_route.get('/adminLogout', adminAuthentication.isAdminLogin, adminController.adminLogout);

// admin dashboard
admin_route.get('/dashboard', adminAuthentication.isAdminLogin, adminController.adminDashboard);

// add new user page load
admin_route.get('/newUser', adminAuthentication.isAdminLogin, adminController.addNewUserLoad);

// add new user
admin_route.post('/newUser',adminController.addNewUser);


admin_route.get('*', (req,res) => {
    res.redirect("/admin");
})




module.exports = {
    admin_route
}
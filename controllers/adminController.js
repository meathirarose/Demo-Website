const User = require('../models/userdbModel');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring')

// admin login
const adminLoad = async (req, res) => {

    try {

        res.render('adminLogin');

    } catch (error) {
        console.log(error.message);
    }
}

// verify admin login
const verifyAdminLogin = async (req, res) => {

    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });
        if (userData) {

            const passMatch = await bcrypt.compare(password, userData.password);
            if (passMatch) {

                if (userData.is_admin === 0) {

                    res.render('adminLogin', { message: "email and password incorrect" })

                } else {

                    req.session.user_id = userData._id;
                    res.redirect('/admin/adminHome');

                }

            } else {

                res.render('adminLogin', { message: "email and password incorrect" });

            }

        } else {

            res.render('adminLogin', { message: "email and password incorrect" });

        }

    } catch (error) {
        console.log(error.message);
    }

}

// load admin dashboard
const loadDashboard = async (req, res) => {

    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('adminHome', { admin: userData });

    } catch (error) {
        console.log(error.message);
    }

}

// admin logout
const adminLogout = async (req, res) => {

    try {

        req.session.destroy();
        res.redirect('/admin');

    } catch (error) {
        console.log(error.message);
    }

}

// admin dashboard
const adminDashboard = async (req, res) => {

    try {
        const userData = await User.find({is_admin:0});
        res.render('adminDashboard', {users: userData});

    } catch (error) {
        console.log(error.me);
    }

}

// add new user page load
const addNewUserLoad = async (req, res) => {

    try {
        
        res.render('newUser');

    } catch (error) {
        console.log(error.message);
    }

}

// password hash
const securePassword = async (password) => {

    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }

}

// add new user
const addNewUser = async (req, res) => {

    try {
        
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: spassword,
            is_admin: 0
        });

        const userData = await user.save();

        if(userData){

            res.redirect('/admin/dashboard');

        }else{
            res.render('newUser', { message: "Some error occured" });
        }

    } catch (error) {
        console.log(error.message);
    }

}

// edit user
const editUserLoad = async (req, res) => {

    try {
        
        res.render('editUser');

    } catch (error) {
        console.error(error.message);
    }

}


module.exports = {
    adminLoad,
    verifyAdminLogin,
    loadDashboard,
    adminLogout,
    adminDashboard,
    addNewUserLoad,
    addNewUser,
    editUserLoad
}
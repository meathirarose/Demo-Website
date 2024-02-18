const User = require('../models/userdbModel');
const bcrypt = require('bcrypt');

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

        const adminData = await User.findOne({ email: email });

        if (adminData) {

            const passMatch = await bcrypt.compare(password, adminData.password);
            if (passMatch) {

                if (adminData.is_admin === 0) {

                    res.render('adminLogin', { message: "You are not admin..!" })

                } else {

                    req.session.admin_id = adminData._id;

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

// load admin home
const loadDashboard = async (req, res) => {

    try {
        const userData = await User.findById({ _id: req.session.admin_id });
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

        var search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        const userData = await User.find({
            is_admin: 0,
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                { mobile: { $regex: '.*' + search + '.*' } }
            ]
        });

        res.render('adminDashboard', { users: userData });

    } catch (error) {
        console.log(error.message);
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

        if (/^[a-zA-Z0-9._%+-]+@(?:gmail|yahoo).com$/.test(req.body.email)) {
            if (/^\d{10}$/.test(req.body.mobile)) {

                const checkMail = await User.findOne({ email: req.body.email });
                if (checkMail) {
                    res.render('newUser', { message: " Email already exists..!" });
                } else {


                    const spassword = await securePassword(req.body.password);
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mobile,
                        password: spassword,
                        is_admin: 0
                    });

                    const userData = await user.save();

                    if (userData) {

                        res.render('newUser', { message: "User added Successfully..!" });

                    } else {
                        res.render('newUser', { message: "Failed to add User..!" });
                    }
                }

            } else {
                res.render('newUser', { message: "Enter a valid mobile number..!" });
            }

        } else {
            res.render('newUser', { message: "Wrong mail structure..!" });
        }
    } catch (error) {
        console.log(error.message);
    }

}

// edit user
const editUserLoad = async (req, res) => {

    try {

        const id = req.query.id;
        const userData = await User.findById({ _id: id });
        if (userData) {
            res.render('editUser', { users: userData });
        } else {
            res.redirect('/admin/adminDashboard');
        }

    } catch (error) {
        console.error(error.message);
    }

}

// update user
const updateUser = async (req, res) => {

    try {

        const users = await User.findOne({ _id: req.body.id })
        const checkemail = await User.findOne({ email: req.body.email })

        if (checkemail && checkemail._id.toString() !== req.body.id) {
            res.render('editUser', { users, message: "Email already exist" })
        }

        const name = req.body.name; const email = req.body.email;
        const emailRegex = /^[A-Za-z0-9.%+-]+@gmail\.com$/;

        if (!emailRegex.test(email)) {
            return res.render('editUser', { users, message: 'Invalid email provided' });
        }

        if (!name || !/^[a-zA-Z][a-zA-Z\s]*$/
            .test(name)) {
            return res.render('editUser', { users, message: 'Invalid name provided' });
        }

        const userData = await User.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile, is_varified: req.body.verify } })
        res.redirect('/admin/adminDashboard')

    } catch (error) {
        console.log(error.message);
    }

}

// delete user
const deleteUser = async (req, res) => {

    try {

        const id = req.query.id;
        const userData = await User.deleteOne({ _id: id },)
        res.redirect('/admin/adminDashboard');

    } catch (error) {
        console.log(error.message);
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
    editUserLoad,
    updateUser,
    deleteUser
}
const User = require("../models/userdbModel");
const bcrypt = require('bcrypt');

// login user
const loginLoad = async (req, res) => {

    try {

        res.render("login");

    } catch (error) {
        console.log(error.message);
    }

}

// verify login
const verifyLogin = async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });

        if (userData) {

            const passMatch = await bcrypt.compare(password, userData.password)
            if (passMatch) {
                if (userData.is_varified === 0) {
                    res.render('login', { message: 'Not verified' });
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                }

            } else {
                res.render('login', { message: "Incorrect email and password" });
            }

        } else {
            res.render('login', { message: "Incorrect email and password" });
        }

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

// signup
const signupLoad = async (req, res) => {

    try {

        res.render('signup');

    } catch (error) {
        console.log(error.message);
    }

}

// submit user
const insertUser = async (req, res) => {

    try {
        if (/^[a-zA-Z][a-zA-Z\s]*$/.test(req.body.name)) {
            if (/^[a-zA-Z0-9._%+-]+@(?:gmail|yahoo).com$/.test(req.body.email)) {
                if (/^\d{10}$/.test(req.body.mobile)) {
                const checkemail = await User.findOne({ email: req.body.email })
                if (checkemail) {
                    res.render('signup', { message: "Email is already exist..!" })
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
                        res.render('signup', { message: "Registered Successfully..!!" });
                    } else {
                        res.render('signup', { message: "Registration Failed..!!" });
                    }
                }
            }else{
                res.render('signup', { message: "Enter a valid number..!" })
            }

            } else {
                res.render('signup', { message: "Enter a valid email..!" })
            }
        } else {
            res.render('signup', { message: "Enter a valid name..!" })
        }


    } catch (error) {
        console.log(error.message);
    }

}

// home
const homeLoad = async (req, res) => {

    try {
        const userData = await User.findById({ _id: req.session.user_id });

        res.render('home', { user: userData });

    } catch (error) {
        console.log(error.message);
    }

}

// user logout
const userLogout = async (req, res) => {

    try {

        req.session.destroy();
        res.redirect('/');

    } catch (error) {
        console.log(error.message);
    }

}

// user profile edit $ update
const editLoad = async (req, res) => {

    try {

        const id = req.query.id;

        const userData = await User.findById({ _id: id });
        if (userData) { }
        else {
            res.redirect('/');
        }



    } catch (error) {
        console.log(error.message);
    }

}


module.exports = {
    loginLoad,
    verifyLogin,
    signupLoad,
    insertUser,
    homeLoad,
    userLogout,
    editLoad
}
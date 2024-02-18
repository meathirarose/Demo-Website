const express = require('express');
const app = express();
const nocache = require('nocache');


const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/loginDB");

app.use(nocache());

const PORT = process.env.PORT || 3000;

// for user route
const userRoute = require('./routes/userRoute');
app.use('/',userRoute.user_route);

// for admin route
const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute.admin_route);

app.listen(PORT, () => {
    console.log(`Listening to server at http://localhost:${3000}`);
})
const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/loginDB");

const PORT = process.env.PORT || 3000;

// for user route
const userRoute = require('./routes/userRoute');
app.use('/',userRoute.user_route);


app.listen(PORT, () => {
    console.log(`Listening to server at http://localhost:${3000}`);
})
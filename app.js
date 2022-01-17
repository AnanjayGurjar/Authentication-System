require("dotenv").config();
require('./config/database').connect();
const express = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./model/user');
const auth = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const app = express();

//as we know express doesn't handle the json file directly it just cannot thus it need to use a middleware
app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("<h1>Hello from auth system - LCO</h1>");

});

app.post("/register", async (req, res) => {
    try {
        //get all the information
        const {firstName, lastName, email, password} = req.body;    //obviously we can use const firstName = req.body.firstName 

        //check all the mandatory fields
        if(!(email && password && firstName && lastName)){
            res.status(400).send('All the fields are mandatory');       //once we send res.status the code after this will not execute
        }

        //check if the user is already registered
        const exisitingUser = await User.findOne({email});        //always consider that your databse is in the different continent and hence can take time to fetch the result and thus we should use await
        //this will always return a promise

        if(exisitingUser){
            res.status(401).send('User already Exists');
        }

        //encrypting the password
        const myEncPassword = await bcrypt.hash(password, 10)           //password and number of rounds of encryption you want to perform
        
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: myEncPassword
        });

        //creating token for the user
        const token = jwt.sign(
            {user_id: user._id,email},
            process.env.SECRET_KEY,
            {
                expiresIn: "2h"
            }
        )
        user.token = token
        //update or not in db

        //TODO: handle password situation
        user.password = undefined;

        //send token or send just success yes and redirect
        res.status(201).json(user)
    } catch (error) {
        console.log(error);
    }
});

app.post("/login",async (req, res) => {     //async since we need to work with database(and always remember the assumption that database is in different continent)
    try {
        const {email, password} = req.body;

        if(!(email && password)){
            res.status(400).send("Field is missing");
        }

        const user = await User.findOne({email});
        // if(!user){
        //     res.status(400).send("You are not registered in our app, please register");
        // }

        // await bcrypt.compare(password, user.password)
        
        if(user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.SECRET_KEY,
                {
                    expiresIn: "2h"
                }
            )


            user.token = token;
            user.password = undefined;
            // res.status(200).json(user);

            //if you want to use cookies
            const options = {
                expires: new Date(
                    Date.now() + 3*24*60*60*1000
                ),
                httpOnly: true,     //it'll allow cookie to only be read by backend server

            };
            res.status(200).cookie('token', token, options).json({
                success: true,
                token,
                user,
            })

        }

        res.status(400).send("Email or password is incorrect");

    } catch (error) {
        console.log(error);
    }
});

app.get("/dashboard", auth, (req, res)=> {
    res.send("Welcome to secret information");
    //protecting the route
    /**
     * use middleware
     * check for token presence
     * verify the token
     * extract info from payload
     * NEXT()
     */
});

module.exports = app
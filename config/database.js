const mongoose = require('mongoose');

const {MONGODB_URL} = process.env;

exports.connect = () => {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        //anything you do with mongo or mongoose they are always a promise
    })
    .then(
        console.log("DB connected succesfully")
    )
    .catch(error=>{
        console.log("DB connection failed");
        console.log(error);
        process.exit(1)
    })
    
}
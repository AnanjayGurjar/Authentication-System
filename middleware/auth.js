//lets write our first custom middleware
const jwt = require('jsonwebtoken');

//model is optional here

const auth = (req, res, next) => {
    //now token usually travels via the headers
    console.log(req.cookies);
    const token = 
    //   req.header("Authorization").replace('Bearer ', '') ||
    //   req.cookies.token ||
    //   req.body.token; 

    req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace('Bearer ', ''); //as token in the header always comeup in the format Bearer <token>

    if(!token){
        return res.status(403).send("Token is missing");
    }

    //if codeflow is here than its confirmed that we have token right now
    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decode);
        req.user = decode;
        //you can also bring in info from the db also

    } catch (error) {
        return res.status(401).send("Invalid token");
    }
    return next();
}

module.exports = auth;

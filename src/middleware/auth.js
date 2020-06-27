const jwt = require("jsonwebtoken");
const User = require('../models/user');

const auth = async (req, res, next) => {
    console.log("into auth middleware");
    try{
        const token = req.header("Authorization").replace('Bearer ', '');
        console.log(token);
        //check validity of token
        const decoded = jwt.verify(token, "taskmanagerapp");
        //it will verify from the pushed tokens
        const user = await User.findOne({ _id : decoded._id, 'tokens.token' : token });

        if(!user) {
            throw new Error();
        }

        req.user = user;
        next();

    }
    catch(ex) {
        res.status(401).send("authenticate first");
    }
};

module.exports = auth;
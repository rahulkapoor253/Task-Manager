const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');

// //test router
// router.get('/test', (req, res) => {
//     res.send("Test route is working fine...");
// });

//---------------User Routes------------------------
router.get('/users/me', auth, async (req, res) => {
    //to handle if any error occurs
   res.send(req.user);

});

router.post('/users/login', async (req, res) => {
    try{
        //custom model functions
        const user = await User.findByCredentials(req.body.email, req.body.password);
        console.log("user found");
        const token = await user.generateAuthToken();

        console.log({ user, token });
        res.send({ user, token });
    }catch(ex) {
        res.status(400).send(ex);
    }

});

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    //returns a promise
    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.send({ user, token });
    }
    catch(ex) {
        res.status(400);
        res.send(ex);
    }

});

router.get('/users/:id', async (req, res) => {
    console.log(req.params.id);
    const _id = req.params.id;
    try{
        const user = await User.findById(_id);
        if(user) {
            console.log(user);
            res.send(user);
        }
        else {
            res.status(400);
            res.send("No user found with this id : " + _id);
        }
    }
    catch(ex) {
        res.status(500);
        res.send(ex);
    }

});

router.patch('/users/:id', async (req, res) => {
    const _id = req.params.id;
    //restriction on key updates
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if(!isValid) {
        return res.status(400).send("Invalid key update");
    }

    //in findidandupdate we just provide the fields that we want to be updated
    try{
        //need to change logic of updating as we need to run 'save' to fire middleware to hash password
        const user = await User.findById(_id);
        updates.forEach((update) => user[update] = req.body[update] );
        await user.save();
        //const updatedUser = await User.findByIdAndUpdate(_id, req.body, { new : true, runValidators : true });
        //we can have error, no user with id, update success
        if(!user) {
            res.status(400);
            res.send("Something went wrong");
        }
        else {
            console.log(user);
            res.send(user);
        }
    }
    catch(ex) {
        res.status(500);
        res.send(ex);
    }

});

router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try{
        const deletedUser = await User.findByIdAndDelete(_id);
        if(!deletedUser){
            res.status(400).send("No user with id : " + _id + " to delete");
        }
        else {
            res.send(deletedUser);
        }
    }catch(ex) {
        res.status(500).send(ex);
    }

});

module.exports = router;
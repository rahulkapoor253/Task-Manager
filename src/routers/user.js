const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');
const sharp = require('sharp');
const multer = require('multer');
var upload = multer({ 
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("File extensions must be jpg jpeg or png file"));
        }
        cb(undefined, true);
        // cb(undefined, false);
    }
});

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

router.post('/users/logout', auth, async (req, res) => {
    //we will check the token from the tokens array and filter it out when found
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await req.user.save();
        res.send("user logged out");

    }catch(ex) {
        res.status(500).send("Something went wrong while logging you out...");
    }

});

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send("all sessions logged out");

    }catch(ex) {
        res.status(500).send("Something went wrong while logging you out of all sessions...");
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

//we can only update our own profile
router.patch('/users/me', auth, async (req, res) => {
    //restriction on key updates
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if(!isValid) {
        return res.status(400).send("Invalid key update");
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update] );
        await req.user.save();
       res.send(req.user);
    }
    catch(ex) {
        res.status(500);
        res.send(ex);
    }

});

//we will not use :id as we dont want a user to affect others data
router.delete('/users/me', auth, async (req, res) => {
    try{
        await req.user.remove();
        console.log(req.user);
        res.send("user deleted");
    }catch(ex) {
        res.status(500).send(ex);
    }

});

//authenticate the file upload
//upload file route using multer
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //before saving image we need to resize it
    const imageBuffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer();
    req.user.avatar = imageBuffer;
    await req.user.save();
    console.log("file upload successfuly");
    res.send();
}, (error, req, res, next)  => {
    res.status(400).send({ error : error.message });
});

//delete profile avatar route
router.delete('/users/me/avatar', auth, async (req, res) => {
    //we can make the binary stored as undefined
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
} );

//get user avatar
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
            throw new Error("user or avatar related to user not found. Try again...");
        }
        else {
            res.set('Content-Type', 'image/png');
            res.send(user.avatar);
        }

    }catch(ex) {
        res.status(404).send(ex);
    }

});

module.exports = router;
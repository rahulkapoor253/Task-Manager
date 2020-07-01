const request = require('supertest');
const app = require('../src/appnew');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../src/models/user');

const userId = new mongoose.Types.ObjectId();
//setup a base user
const userOne = {
    _id : userId,
    name : 'Rahul',
    email : 'rahul253@gmail.com',
    password : 'qwerty253',
    tokens : [
        {
            token : jwt.sign({ _id : userId }, process.env.JWT_SECRET)
        }
    ]
}

//it runs before each test case
beforeEach(async () => {
    //console.log("it runs before");
    await User.deleteMany();
    await new User(userOne).save();
});

// //it runs after each testcase
// afterEach(() => {
//     console.log("it runs after");
// });

//post a new user
test('signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name : 'Rahul Kapoor',
        email : 'rahul123@gmail.com',
        password : 'qwerty123'
    }).expect(200)

    //make assertions on the response object and verify data
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    expect(response.body.user.name).toBe('Rahul Kapoor');
});

//user login success
test('log in existing user', async () => {
    await request(app).post('/users/login').send({
        email : userOne.email,
        password : userOne.password
    }).expect(200)
});

//user login failed
test('log in existing user failed', async () => {
    await request(app).post('/users/login').send({
        email : userOne.email,
        password : 'failedlogin'
    }).expect(400)
});

//fetch user profile
test('fetch user profile', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
} );

//fetch user profile failed without setting the auth token
test('fetch user profile', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
} );

//delete user success
test('fetch user profile', async () => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userId);
    expect(user).toBeNull();
} );

//delete user failure without setting auth token
test('fetch user profile', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
} );
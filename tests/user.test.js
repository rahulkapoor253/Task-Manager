const request = require('supertest');
const app = require('../src/appnew');
const User = require('../src/models/user');

const userOne = {
    name : 'Rahul',
    email : 'rahul253@gmail.com',
    password : 'qwerty253'
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
//clear database each time test lifecycle runs
test('signup a new user', async () => {
    await request(app).post('/users').send({
        name : 'Rahul Kapoor',
        email : 'rahul123@gmail.com',
        password : 'qwerty123'
    }).expect(200)

});

test('log in existing user', async () => {
    await request(app).post('/users/login').send({
        email : userOne.email,
        password : userOne.password
    }).expect(200)

});

test('log in existing user failed', async () => {
    await request(app).post('/users/login').send({
        email : userOne.email,
        password : 'failedlogin'
    }).expect(400)

});
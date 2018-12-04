const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const mockedTodos = [
    { _id: new ObjectID(), text: 'First test todo', _creator: userOneId },
    { _id: new ObjectID(), text: 'Second test todo', _creator: userTwoId },
    {
        _id: new ObjectID(),
        text: 'Third test todo',
        completed: true,
        completedAt: 333,
        _creator: userTwoId,
    },
];

const mockedUsers = [
    {
        _id: userOneId,
        email: 'mat@example.com',
        password: 'userOnePass',
        tokens: [
            {
                access: 'auth',
                token: jwt
                    .sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET)
                    .toString(),
            },
        ],
    },
    {
        _id: userTwoId,
        email: 'jen@example.com',
        password: 'userTwoPass',
        tokens: [
            {
                access: 'auth',
                token: jwt
                    .sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET)
                    .toString(),
            },
        ],
    },
];

const populateTodos = done => {
    Todo.deleteMany({})
        .then(() => Todo.insertMany(mockedTodos))
        .then(() => done());
};

const populateUsers = done => {
    User.deleteMany({})
        .then(() => {
            const userOne = new User(mockedUsers[0]).save();
            const userTwo = new User(mockedUsers[1]).save();

            return Promise.all([userOne, userTwo]);
        })
        .then(() => done());
};

module.exports = { mockedTodos, mockedUsers, populateTodos, populateUsers };

const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const { ObjectID } = require('mongodb');

const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');
require('./config/config');
require('./db/mongoose');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id,
    });

    todo.save()
        .then(doc => res.send(doc))
        .catch(error => res.status(400).send(error));
});

app.get('/todos', authenticate, (req, res) =>
    Todo.find({ _creator: req.user._id })
        .then(todos => res.send({ todos }))
        .catch(e => {
            res.status(400).send(e);
        }),
);

app.get('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOne({ _id: id, _creator: req.user._id })
        .then(todo => (todo ? res.send({ todo }) : res.status(404).send()))
        .catch(() => res.status(400).send());
});

app.delete('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOneAndDelete({ _id: id, _creator: req.user._id })
        .then(todo => (todo ? res.send({ todo }) : res.status(404).send()))
        .catch(e => res.status(400).send());
});

app.patch('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true })
        .then(todo => (todo ? res.send({ todo }) : res.status(404).send()))
        .catch(() => {
            res.status(400).send();
        });
});

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);

    user.save()
        .then(() => user.generateAuthToken())
        .then(token => res.header('x-auth', token).send(user))
        .catch(error => res.status(400).send(error));
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    const { email, password } = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(email, password)
        .then(user => {
            return user.generateAuthToken().then(token => {
                res.header('x-auth', token).send(user);
            });
        })
        .catch(() => {
            res.status(400).send();
        });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user
        .removeToken(req.token)
        .then(() => {
            res.status(200).send();
        })
        .catch(() => {
            res.status(400).send();
        });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };

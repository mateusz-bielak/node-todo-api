const bodyParser = require('body-parser');
const express = require('express');
const { ObjectID } = require('mongodb');

require('./db/mongoose');
const { Todo } = require('./models/todo');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text,
    });

    todo.save()
        .then(doc => res.send(doc))
        .catch(error => res.status(400).send(error));
});

app.get('/todos', (_, res) =>
    Todo.find()
        .then(todos => res.send({ todos }))
        .catch(e => {
            console.log(e);
            res.status(400).send(e);
        }),
);

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id)
        .then(todo => (todo ? res.send({ todo }) : res.status(404).send()))
        .catch(e => res.status(400).send());
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };

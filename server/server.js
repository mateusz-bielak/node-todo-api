const express = require('express');
const bodyParser = require('body-parser');

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

app.get('/todos', (req, res) =>
    Todo.find()
        .then(todos => res.send({ todos }))
        .catch(e => {
            console.log(e);
            res.status(400).send(e);
        }),
);

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };

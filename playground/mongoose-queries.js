const { ObjectID } = require('mongodb');
const { Todo } = require('../server/models/todo');

const id = '5bdf251b588b726cad3ae275';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
}

// Todo.find({
//     _id: id,
// }).then(console.log);

// Todo.findOne({
//     _id: id,
// }).then(console.log);

Todo.findById(id)
    .then(todo => {
        if (!todo) {
            return console.log('Id not found');
        }

        console.log(todo);
    })
    .catch(e => console.log(e));

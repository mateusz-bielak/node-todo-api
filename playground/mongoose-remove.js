const { ObjectID } = require('mongodb');
const { Todo } = require('../server/models/todo');
require('../server/db/mongoose');

// Todo.remove({}).then(console.log);

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

Todo.findByIdAndRemove('5befffb2752ac93745375f6e').then(todo => {
    console.log(todo);
});

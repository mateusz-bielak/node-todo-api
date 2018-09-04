const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Number,
        default: null,
    },
});

// const newTodo = new Todo({
//   text: "Cook dinner"
// });

const newTodo = new Todo({
    text: 'Go shopping',
});

// newTodo
//     .save()
//     .then(doc => {
//         console.log('Saved todo', doc);
//     })
//     .catch(e => console.log('Unable to save todo', e));

const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
});

const newUser = new User({
    email: 'example@mail.com',
});

newUser
    .save()
    .then(doc => {
        console.log('Added user', doc);
    })
    .catch(e => console.log('Unable to add user', e));

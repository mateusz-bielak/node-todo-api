const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const mockedTodos = [
    { text: 'First test todo' },
    { text: 'Second test todo' },
    { text: 'Third test todo' },
];

beforeEach(done => {
    Todo.remove({})
        .then(() => Todo.insertMany(mockedTodos))
        .then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', done => {
        const text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect(res => expect(res.body.text).toBe(text))
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text })
                    .then(todos => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch(done);
            });
    });

    it("shouldn't create todo with invalid body data", done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find()
                    .then(todos => {
                        expect(todos.length).toBe(mockedTodos.length);
                        done();
                    })
                    .catch(done);
            });
    });

    it('should get all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => expect(res.body.todos.length).toBe(mockedTodos.length))
            .end(done);
    });
});

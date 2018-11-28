const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { Todo } = require('../models/todo');
const { app } = require('../server');
const { mockedTodos, mockedUsers, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /todos/:id', () => {
    it('should return the doc', done => {
        request(app)
            .get(`/todos/${mockedTodos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(mockedTodos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', done => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', done => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', done => {
        const hexId = mockedTodos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId)
                    .then(todo => {
                        expect(todo).toBeFalsy();
                        done();
                    })
                    .catch(done);
            });
    });

    it('should return 404 if todo not found', done => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', done => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', done => {
        const hexId = mockedTodos[0]._id.toHexString();
        const text = 'New testing text';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text, completed: true })
            .expect(200)
            .expect(({ body: { todo } }) => {
                expect(todo._id).toBe(hexId);
                expect(todo.completed).toBe(true);
                expect(todo.text).toBe(text);
                expect(typeof todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', done => {
        const hexId = mockedTodos[2]._id.toHexString();
        const text = 'New testing text';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text, completed: false })
            .expect(200)
            .expect(({ body: { todo } }) => {
                expect(todo._id).toBe(hexId);
                expect(todo.completed).toBe(false);
                expect(todo.text).toBe(text);
                expect(todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});

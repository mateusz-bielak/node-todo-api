const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { app } = require('../server');
const { mockedTodos, mockedUsers, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', done => {
        const text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', mockedUsers[0].tokens[0].token)
            .send({ text })
            .expect(200)
            .expect(res => expect(res.body.text).toBe(text))
            .end(err => {
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
            .set('x-auth', mockedUsers[0].tokens[0].token)
            .send({})
            .expect(400)
            .end(err => {
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
            .set('x-auth', mockedUsers[0].tokens[0].token)
            .expect(200)
            .expect(res => expect(res.body.todos.length).toBe(1))
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return the doc', done => {
        request(app)
            .get(`/todos/${mockedTodos[0]._id.toHexString()}`)
            .set('x-auth', mockedUsers[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(mockedTodos[0].text);
            })
            .end(done);
    });

    it('should not return the doc created by other user', done => {
        request(app)
            .get(`/todos/${mockedTodos[1]._id.toHexString()}`)
            .set('x-auth', mockedUsers[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', done => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', mockedUsers[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', done => {
        request(app)
            .get('/todos/123')
            .set('x-auth', mockedUsers[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', done => {
        const hexId = mockedTodos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', mockedUsers[1].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end(err => {
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

    it('should not remove a todo created by other user', done => {
        const hexId = mockedTodos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', mockedUsers[0].tokens[0].token)
            .expect(404)
            .end(err => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId)
                    .then(todo => {
                        expect(todo).toBeTruthy();
                        done();
                    })
                    .catch(done);
            });
    });

    it('should return 404 if todo not found', done => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', mockedUsers[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', done => {
        request(app)
            .delete('/todos/123')
            .set('x-auth', mockedUsers[0].tokens[0].token)
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
            .set('x-auth', mockedUsers[0].tokens[0].token)
            .expect(200)
            .expect(({ body: { todo } }) => {
                expect(todo._id).toBe(hexId);
                expect(todo.completed).toBe(true);
                expect(todo.text).toBe(text);
                expect(typeof todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should not update the todo created by other user', done => {
        const hexId = mockedTodos[0]._id.toHexString();
        const text = 'New testing text';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text, completed: true })
            .set('x-auth', mockedUsers[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should clear completedAt when todo is not completed', done => {
        const hexId = mockedTodos[2]._id.toHexString();
        const text = 'New testing text';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text, completed: false })
            .set('x-auth', mockedUsers[1].tokens[0].token)
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

describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', mockedUsers[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(mockedUsers[0]._id.toHexString());
                expect(res.body.email).toBe(mockedUsers[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', done => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', done => {
        const email = 'example@example.com';
        const password = '123mnb!';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end(err => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email })
                    .then(user => {
                        expect(user).toBeTruthy();
                        expect(user.password).not.toBe(password);
                        done();
                    })
                    .catch(done);
            });
    });

    it('should return validation errors if request invalid', done => {
        const email = 'thisIsNotAnEmail';
        const password = 10;

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', done => {
        const email = mockedUsers[0].email;
        const password = 'abcd456&';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', done => {
        request(app)
            .post('/users/login')
            .send({
                email: mockedUsers[1].email,
                password: mockedUsers[1].password,
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(mockedUsers[1]._id)
                    .then(user => {
                        expect(user.tokens[1]).toMatchObject({
                            access: 'auth',
                            token: res.headers['x-auth'],
                        });
                        done();
                    })
                    .catch(done);
            });
    });

    it('should reject invalid login', done => {
        request(app)
            .post('/users/login')
            .send({
                email: mockedUsers[1].email,
                password: 'wrong-password',
            })
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end(err => {
                if (err) {
                    return done(err);
                }

                User.findById(mockedUsers[1]._id)
                    .then(user => {
                        expect(user.tokens.length).toBe(1);
                        done();
                    })
                    .catch(done);
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', done => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', mockedUsers[0].tokens[0].token)
            .expect(200)
            .end(err => {
                if (err) {
                    return done(err);
                }

                User.findById(mockedUsers[0]._id)
                    .then(user => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    })
                    .catch(done);
            });
    });
});

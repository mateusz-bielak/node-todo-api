const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [
        {
            access: {
                type: String,
                required: true,
            },
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    const user = this;
    const access = 'auth';
    const token = jwt
        .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
        .toString();

    user.tokens = user.tokens.concat([{ access, token }]);

    return user.save().then(() => token);
};

UserSchema.methods.removeToken = function(token) {
    const user = this;

    return user.updateOne({
        $pull: {
            tokens: { token },
        },
    });
};

UserSchema.statics.findByToken = function(token) {
    const User = this;
    let decoded = undefined;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth',
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    const User = this;

    return User.findOne({ email }).then(user => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            return bcrypt.compare(password, user.password, (err, res) =>
                res ? resolve(user) : reject(),
            );
        });
    });
};

UserSchema.pre('save', function(next) {
    const user = this;

    if (user.isModified('password')) {
        const password = user.password;

        return bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(password, salt, (err, hash) => {
                user.password = hash;
                next();
            }),
        );
    }

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };

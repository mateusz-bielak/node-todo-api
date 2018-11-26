// const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
    id: 10,
};

const token = jwt.sign(data, '123abc');

console.log(token);

const decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);

// const text = 'I am a user number 3';
// const hash = SHA256(text).toString();

// console.log(`Message: ${text}`);
// console.log(`Hash: ${hash}`);

// const data = {
//     id: 4,
// };

// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString(),
// };

// // token.data.id = 5;

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not change');
// } else {
//     console.log('Data was changed');
// }

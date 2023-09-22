const crypto = require('crypto');

const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);
const date = new Date();
// console.log(date);
console.log(date.toString());
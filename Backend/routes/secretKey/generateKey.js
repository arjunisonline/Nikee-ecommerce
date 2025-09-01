const crypto = require('crypto');


//Generate SecretKey
const generateSecretkey = () => {
    return crypto.randomBytes(32).toString('hex');
};
console.log(generateSecretkey());
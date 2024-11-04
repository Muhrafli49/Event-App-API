const dotenv = require('dotenv');
const { createRefreshJWT } = require('./utils');
dotenv.config();

module.exports = {
    urlDb: process.env.URL_MONGODB_DEV,
    jwtExpiration: '24h',
    jwtSecret: process.env.JWT_SECRET_KEY,
    jwtRefreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    gmail: process.env.GMAIL,
    password: process.env.PASSWORD,
};


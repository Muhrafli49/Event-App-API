const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const app = express();

// import router categories
const categoriesRouter = require('./app/api/v1/categories/router');

// inisiasi route v1
const v1 = '/api/v1/cms';

// import middleware
const notFoundMiddleware = require('./app/middleware/not-found');
const handlerErrorMiddleware = require('./app/middleware/handler-error');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// test server
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the API'
    })
})

// Menggunakan API category
app.use(v1, categoriesRouter);

// Menggunakan handler error
app.use(notFoundMiddleware);
app.use(handlerErrorMiddleware);

module.exports = app;

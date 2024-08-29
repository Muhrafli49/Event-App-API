const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const app = express();

// import router categories
const categoriesRouter = require('./app/api/v1/categories/router');

// import router images
const imagesRouter = require('./app/api/v1/images/router');

// import router talents
const talentsRouter = require('./app/api/v1/talents/router');

// import router events
const eventsRouter = require('./app/api/v1/events/router');

// import router organizers
const organizersRouter = require('./app/api/v1/organizers/router');

// import router organizers
const authCMSRouter = require('./app/api/v1/auth/router');

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

// Menggunakan API image
app.use(v1, imagesRouter);

// Mengunakan API talent
app.use(v1, talentsRouter);

// Mengunakan API event
app.use(v1, eventsRouter);

// Mengunakan API organizer
app.use(v1, organizersRouter);

// Mengunakan API organizer
app.use(v1, authCMSRouter);

// Menggunakan handler error
app.use(notFoundMiddleware);
app.use(handlerErrorMiddleware);

module.exports = app;

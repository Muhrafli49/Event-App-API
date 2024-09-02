const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const app = express();

// inisiasi route v1
const v1 = '/api/v1';

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

// import router orders
const ordersRouter = require('./app/api/v1/orders/router');

// import router participants
const participantsRouter = require('./app/api/v1/participants/router');


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
app.use(`${v1}/cms`, categoriesRouter);

// Menggunakan API image
app.use(`${v1}/cms`, imagesRouter);

// Mengunakan API talent
app.use(`${v1}/cms`, talentsRouter);

// Mengunakan API event
app.use(`${v1}/cms`, eventsRouter);

// Mengunakan API organizer
app.use(`${v1}/cms`, organizersRouter);

// Mengunakan API organizer
app.use(`${v1}/cms`, authCMSRouter);

// Mengunakan API orders
app.use(`${v1}/cms`, ordersRouter);

// Mengunakan API participants
app.use(v1, participantsRouter);


// Menggunakan handler error
app.use(notFoundMiddleware);
app.use(handlerErrorMiddleware);

module.exports = app;

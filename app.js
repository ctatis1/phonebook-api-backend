const config = require('./utils/config');
const express = require('express');
const cors = require('cors');
const contactRouter = require('./controllers/contacts');
const userRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

const app = express();

logger.info('Connecting to: ', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB');
    })
    .catch(error => {
        logger.error('Error connecting to MongoDB', error.message);
    })

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

app.use('/api/contacts', contactRouter);
app.use('/api/users', userRouter);

app.use(middleware.requestLogger);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app
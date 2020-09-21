const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
dotenv.config({ path: './config/_config.env' });
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

const connectDb = require('./config/database');
connectDb();

const errorHandler = require('./middleware/error');
const logger = require('./middleware/logger');
const auth = require('./routes/auth');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const reviews = require('./routes/reviews');
const users = require('./routes/users');

if (process.env.NODE_ENV === 'development') {
    app.use(logger);
}

app.use(fileUpload());

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use(errorHandler);

const server_port = process.env.SERVER_PORT;

const server = app.listen(server_port,
    console.log(`Application running through a ${process.env.NODE_ENV} mode on port ${server_port}`.bgCyan.black)
)

process.on('unhandledRejection', (err, promise) =>
{
    console(`There seem to be an error: ${err.message}`.red);
    server.close(() => process.exit(1));
})
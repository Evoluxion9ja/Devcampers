const mongoose = require('mongoose');

const connectDb = async () =>
{
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    console.log(`The application has been connected to Mongodb on ${conn.connection.host} through port ${process.env.SERVER_PORT}`.bgMagenta.white);
}

module.exports = connectDb;
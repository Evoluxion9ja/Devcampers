const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const fileSystem = require('fs');

dotenv.config({ path: './config/_config.env' });

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

const bootcamps = JSON.parse(
    fileSystem.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
    fileSystem.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

const reviews = JSON.parse(
    fileSystem.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

const users = JSON.parse(
    fileSystem.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const importFiles = async () =>
{
    try {
        await User.create(users);
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        // await Review.create(reviews);
        console.log(`All the files have been imported in to the database successfully...`.bgWhite.black);
        process.exit();
    }
    catch (err) {
        console.error(err);    
    }
}

const deleteFile = async () =>
{
    try {
        await User.deleteMany();
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await Review.deleteMany();
        console.log(`All the files have been removed from the database successfully...`.bgRed.white);
        process.exit();
    }
    catch (err) {
        console.error(err);    
    }
}

if (process.argv[2] === '-i') { 
    importFiles();
} else if (process.argv[2] === '-d') {
    deleteFile();
}
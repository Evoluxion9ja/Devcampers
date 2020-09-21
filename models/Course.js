const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide a title for the course']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for the course']
    },
    weeks: {
        type: String,
        required: [true, 'Please specify the number of weeks it takes to complete the course']
    },
    tuition: {
        type: Number,
        required: [true, 'How much does the course cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please specify the minimum skill required to take this course'],
        enum: ['beginner', 'intermediate', 'advance']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: [true, 'Please specify which bootcamp this course belongs to']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'The bootcamp requires a user authentication before it can be created']
    }
})

CourseSchema.statics.getAverageCost = async function (bootcampId)
{
    const object = await this.aggregate([
        {
            $match: {bootcamp: bootcampId}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: {$avg: '$tuition'}
            }
        }
    ])

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(object[0].averageCost / 10) * 10
        })
    }
    catch (err) {
        console.error(err);    
    }
}

CourseSchema.post('save', function (next)
{
    this.constructor.getAverageCost(this.bootcamp);
})

CourseSchema.pre('remove', function (next)
{
    this.constructor.getAverageCost(this.bootcamp);
    next()
})

module.exports = mongoose.model('Course', CourseSchema);
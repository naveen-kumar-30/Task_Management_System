const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title for the task'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },
    description: {
        type: String,
        required: false,
        trim: true,
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['Completed', 'In Progress', 'Not Started'],
        default: 'Not Started'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    date: {
        type: Date,
        required: false
    },
    progress: {
        type: String,
        default: '0%'
    },
    image: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema);
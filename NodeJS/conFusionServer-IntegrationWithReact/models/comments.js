const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        // using mongoose population to populate author
        // from 'User'
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps:true
});
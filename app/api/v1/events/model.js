const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const ticketCategoriesSchema = new Schema({
    type: {
        type: String,
        required: [true, 'Type ticket is required'],
    },
    price: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Number,
        default: 0,
    },
    statusTicketCategories: {
        type: Boolean,
        enum: [true, false],
        default: true,
    },
    expired: {
        type: Date
    },
});

const EventSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title event is required'],
        minlength: 3,
        maxlength: 50, 
    },
    date: {
        type: Date,
        required: [true, 'Date event is required'],
    },
    about: {
        type: String,
    },
    tagline: {
        type: String,
        required: [true, 'Tagline is required']
    },
    keyPoint: {
        type: [String],
    },
    venueName: {
        type: String,
        required: [true, 'Venue name is required']
    },
    statusEvent: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft',
    },
    tickets: {
        type: [ticketCategoriesSchema],
        required: true
    },
    image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image',
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    talent: {
        type: mongoose.Types.ObjectId,
        ref: 'Talent',
        required: true,
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'Organizer',
        required: true
    },
}, 
    { timestamps: true }
);

module.exports = model('Event', EventSchema);

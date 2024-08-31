const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const orderDetailSchema = new Schema({
    ticketCategories: {
        type: {
            type: String,
            required: [true, 'Type ticket must field'],
        },
        price: {
            type: Number,
            default: 0,
        },
    },
    sumTicket: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        personalDetail: {
            firstName: {
                type: String,
                required: [true, 'Please provide first Name'],
                minlength: 3,
                maxlength: 50,
            },
            lastName: {
                type: String,
                required: [true, 'Please provide last Name'],
                minlength: 3,
                maxlength: 50,
            },
            email: {
                type: String,
                required: [true, 'Please provide email'],
            },
            role: {
                type: String,
                default: 'Designer'
            },
        },
        status: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending',
        },
        totalPay: {
            type: Number,
            required: true,
        },
        totalOrderTicket: {
            type: Number,
            required: true
        },
        orderItems: [orderDetailSchema],
        participant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Participant',
            required: true,
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        historyEvent: {
            organizer: {
                type: mongoose.Types.ObjectId,
                ref: 'Organizer',
                required: true
            },
        },
    },

    { timestamps: true }
);

module.exports = model('Order', orderSchema);

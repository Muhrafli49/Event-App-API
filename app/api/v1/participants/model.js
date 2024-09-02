const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const bcrypt = require('bcryptjs');


const participantSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name must field'],
        minlength: 3,
        maxlength: 50,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email must field'],
    },
    password: {
        type: String,
        required: [true, 'Password must field'],
        minlength: 6
    },
    role: {
        type: String,
        default: '-'
    },
    status: {
        type: String,
        enum: ['Active', 'Non-Active'],
        default: 'Non-Active'
    },
    otp: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

participantSchema.pre('save', async function (next) {
    const User = this;
    if(User.isModified('password')) {
        User.password = await bcrypt.hash(User.password, 10);
    }
    next();
});

participantSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('Participant', participantSchema);
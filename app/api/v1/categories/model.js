const mongoose = require('mongoose');
const { model, Schema } = mongoose;


let categorySchema = Schema(
    {
        name: { 
            type: String,
            minLength: [3, 'Panjang nama kategori min 3 karakter'],
            maxLength: [20, 'Panjang nama kategori max 20 karakter'],
            required: [true, 'Nama kategori harus diisi'],
        },
        organizer: {
            type: Schema.Types.ObjectId,
            ref: 'Organizer',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = model('Category', categorySchema);
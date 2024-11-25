const mongoose = require('mongoose');

const KidSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'CharityUser', required: true }, // Updated reference
    age: { type: Number, required: true },
    needs: { type: Object, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Kid', KidSchema);


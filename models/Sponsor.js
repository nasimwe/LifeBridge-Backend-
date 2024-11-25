const mongoose = require('mongoose');

const SponsorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'CharityUser', required: true }, 
    signupDetails: { type: Object, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Sponsor', SponsorSchema);


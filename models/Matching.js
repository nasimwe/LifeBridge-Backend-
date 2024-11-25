const mongoose = require('mongoose');

const MatchingSchema = new mongoose.Schema({
    sponsor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor', required: true },
    kid: { type: mongoose.Schema.Types.ObjectId, ref: 'Kid', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Matching', MatchingSchema);

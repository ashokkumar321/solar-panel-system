const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    masters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Master' }],
});

module.exports = mongoose.model('Area', AreaSchema);
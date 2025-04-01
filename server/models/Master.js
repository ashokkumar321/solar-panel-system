const mongoose = require('mongoose');

const MasterSchema = new mongoose.Schema({
    masterId: { type: String, required: true, unique: true },
    slaves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slave' }],
});

module.exports = mongoose.model('Master', MasterSchema);
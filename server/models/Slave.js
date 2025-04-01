const mongoose = require('mongoose');

const SlaveSchema = new mongoose.Schema({
    slaveId: { type: String, required: true, unique: true },
    data: [{
        date: { type: Date, required: true },
        time: { type: String, required: true },
        actualNSAngle: { type: Number, required: true },
        currentNSAngle: { type: Number, required: true },
        actualEWAngle: { type: Number, required: true },
        currentEWAngle: { type: Number, required: true },
    }],
});

module.exports = mongoose.model('Slave', SlaveSchema);
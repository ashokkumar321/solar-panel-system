const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Area = require('../models/Area');
const Master = require('../models/Master');
const Slave = require('../models/Slave');

const checkRole = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ msg: 'Access denied' });
    next();
};

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt: ${username}`);

    const user = await User.findOne({ username, password });
    if (!user) {
        console.log("Invalid login attempt");
        return res.status(401).json({ msg: 'Invalid credentials' });
    }

    console.log("Login successful for", user.username);
    res.json({ userId: user._id, role: user.role });
});


router.get('/data', checkRole('admin'), async (req, res) => {
    const areas = await Area.find().populate({
        path: 'masters',
        populate: { path: 'slaves' },
    });
    res.json(areas);
});

router.get('/user-data/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId).populate({
        path: 'assignedMasters',
        populate: { path: 'slaves' },
    });
    res.json(user.assignedMasters);
});

router.post('/area', checkRole('admin'), async (req, res) => {
    const { name } = req.body;
    const area = new Area({ name });
    await area.save();
    res.json(area);
});

router.get('/slaves', async (req, res) => {
    const { slaveID, date } = req.query;
    
    let query = {};
    if (slaveID) query.slaveID = slaveID;
    if (date) query.date = date;

    const slaves = await Slave.find(query);
    res.json(slaves);
});

router.get('/filter', async (req, res) => {
    const { masterId, slaveId, date, userId } = req.query;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    let query = {};

    if (masterId) query['masters.masterId'] = masterId;
    if (slaveId) query['slaves.slaveId'] = slaveId;
    if (date) query['slaves.data.date'] = new Date(date);

    if (user.role === 'user') {
        query['masters'] = { $in: user.assignedMasters };
    }

    const data = await Area.find().populate({
        path: 'masters',
        match: query,
        populate: { path: 'slaves', match: query },
    });
    res.json(data);
});

module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('Attempting to connect to MongoDB Atlas...');
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected to SolarPanelDB'))
    .catch(err => console.error('MongoDB Connection Error:', err.message));

app.use('/api', require('./routes/api'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
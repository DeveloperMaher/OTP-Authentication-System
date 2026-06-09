const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.route');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Middleware
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

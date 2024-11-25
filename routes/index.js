const express = require('express');
const adminRoutes = require('./admin');
const sponsorRoutes = require('./sponsor');
const kidRoutes = require('./kid');
const authRoutes = require('./auth');

const router = express.Router();

router.use('/admin', adminRoutes); 
router.use('/sponsor', sponsorRoutes); 
router.use('/kid', kidRoutes); 
router.use('/auth', authRoutes);

module.exports = router;

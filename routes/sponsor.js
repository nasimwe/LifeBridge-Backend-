const express = require('express');
const { signup, getProfile, getMatches } = require('../controllers/sponsorController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();
const { authenticate } = require('../middlewares/aunthenticate')

// Sponsor endpoints
router.post('/signup', authenticate,  signup); 
router.get('/profile', authenticate, getProfile);
router.get('/matches', authenticate, getMatches); 

module.exports = router;

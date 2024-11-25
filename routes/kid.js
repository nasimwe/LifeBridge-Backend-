const express = require('express');
const { signup, getProfile, getSponsor, completeKidProfile } = require('../controllers/kidController');
const auth = require('../middlewares/authMiddleware');
const {authenticate} = require('../middlewares/aunthenticate');
const router = express.Router();

// Kid endpoints
router.post('/signup', signup);
router.get('/profile', authenticate, getProfile); 
router.get('/sponsor', authenticate, getSponsor); 
router.post('/complete-profile', authenticate, completeKidProfile);

module.exports = router;

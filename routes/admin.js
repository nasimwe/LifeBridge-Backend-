const express = require('express');
const {
    getPendingApplications,
    approveApplication,
    rejectApplication,
    matchSponsorWithKids,
    getMatches,
    getAllSponsors, getAllKids
} = require('../controllers/adminController');
const router = express.Router();
const adminAuth = require('../middlewares/authMiddleware');

// Protect admin routes
router.get('/applications', adminAuth, getPendingApplications);
router.post('/approve', adminAuth, approveApplication);
router.post('/reject', adminAuth, rejectApplication);
router.post('/match', adminAuth, matchSponsorWithKids);
router.get('/matches', adminAuth, getMatches);
router.get('/sponsors', adminAuth, getAllSponsors);
router.get('/kids', adminAuth, getAllKids);

module.exports = router;

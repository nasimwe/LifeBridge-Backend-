const Kid = require('../models/Kid');
const Matching = require('../models/Matching');
const Sponsor = require('../models/Sponsor');

// Kid signup
exports.signup = async (req, res) => {
    try {
        const kid = new Kid(req.body);
        kid.status = 'pending'; // Initial status
        await kid.save();
        res.status(201).json({ message: 'Kid application submitted for approval', kid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get kid profile
exports.getProfile = async (req, res) => {
    try {
        const kid = await Kid.findById(req.user._id);
        if (!kid) return res.status(404).json({ message: 'Kid not found' });
        res.json(kid);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSponsor = async (req, res) => {
    try {
        const kid = await Kid.findOne({ user: req.user._id }).populate('user', 'name email');
        if (!kid) {
            return res.status(404).json({ message: 'Kid profile not found.' });
        }

        const matches = await Matching.find({ kid: kid._id })
            .populate({
                path: 'sponsor',
                populate: { path: 'user', select: 'name email' } // Populate sponsor's user details
            });

        if (!matches || matches.length === 0) {
            return res.status(404).json({ message: 'No sponsor assigned yet.' });
        }

        // Map the matches to return all sponsors
        const sponsors = matches.map(match => ({
            name: match.sponsor?.user?.name || "N/A",
            email: match.sponsor?.user?.email || "N/A",
            maxKids: match.sponsor?.signupDetails?.maxKids || "N/A",
            monthlyContribution: match.sponsor?.signupDetails?.monthlyContribution || "N/A",
            preferredSupportAreas: match.sponsor?.signupDetails?.preferredSupportAreas?.join(', ') || "N/A",
            status: match.sponsor?.status || "N/A",
        }));
        res.json({
            kid: {
                name: kid.user?.name || "N/A", 
                email: kid.user?.email || "N/A", 
                age: kid.age || "N/A",
                needs: kid.needs || "N/A",
                status: kid.status || "N/A",
                createdAt: kid.createdAt || "N/A",
            },
            sponsors, // Array of sponsors
        });
    } catch (error) {
        console.error("Error in getSponsor:", error);
        res.status(500).json({ error: error.message });
    }
};



exports.completeKidProfile = async (req, res) => {
    try {
        const { age, needs } = req.body;
        let kid = await Kid.findOne({ user: req.user._id });

        if (!kid) {
            kid = new Kid({
                user: req.user._id, 
                age,
                needs,
                status: 'pending' 
            });
        } else if (kid.status !== 'pending') {
            return res.status(403).json({ message: "Profile already completed or approved." });
        } else {
            kid.age = age;
            kid.needs = needs;
        }

        // Save the new or updated kid profile
        await kid.save();

        res.json({ message: "Profile completed successfully. Await admin approval." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



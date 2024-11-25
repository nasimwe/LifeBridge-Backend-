const Sponsor = require('../models/Sponsor');
const Matching = require('../models/Matching');
const Kid = require('../models/Kid');

// Sponsor signup
exports.signup = async (req, res) => {
    try {
        const userId = req.user.id;
        const sponsor = new Sponsor({
            user: userId, 
            signupDetails: req.body.signupDetails,
        });
        await sponsor.save();

        res.status(201).json({ 
            message: 'Sponsor application submitted for approval', 
            sponsor 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get sponsor profile
exports.getProfile = async (req, res) => {
    try {
        const sponsor = await Sponsor.findById(req.user._id);
        if (!sponsor) return res.status(404).json({ message: 'Sponsor not found' });
        res.json(sponsor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMatches = async (req, res) => {
    try {
        // Find the sponsor document linked to the logged-in user
        const sponsor = await Sponsor.findOne({ user: req.user._id }).populate('user', 'name email');
        if (!sponsor) {
            return res.status(404).json({ message: "Sponsor profile not found." });
        }

        // Check if the sponsor's status is "pending"
        if (sponsor.status === "pending") {
            return res.status(403).json({ message: "Your application is still under review!" });
        }

        // Find matches for the sponsor
        const matches = await Matching.find({ sponsor: sponsor._id }).populate({
            path: 'kid',
            populate: { path: 'user', select: 'name email' }, // Populate kid's user details
        });

        // Format the response
        const response = {
            sponsor: {
                name: sponsor.user?.name || "N/A",
                email: sponsor.user?.email || "N/A",
                maxKids: sponsor.signupDetails?.maxKids || "N/A",
                monthlyContribution: sponsor.signupDetails?.monthlyContribution || "N/A",
                preferredSupportAreas: sponsor.signupDetails?.preferredSupportAreas?.join(', ') || "N/A",
                status: sponsor.status,
            },
            matches: matches.map(match => ({
                kid: {
                    name: match.kid?.user?.name || "N/A",
                    email: match.kid?.user?.email || "N/A",
                    age: match.kid?.age || "N/A",
                    needs: match.kid?.needs || "N/A",
                    status: match.kid?.status || "N/A",
                    createdAt: match.kid?.createdAt || "N/A",
                }
            })),
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


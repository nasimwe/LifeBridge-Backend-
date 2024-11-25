const Sponsor = require('../models/Sponsor');
const Kid = require('../models/Kid');
const Matching = require('../models/Matching');

exports.getPendingApplications = async (req, res) => {
    try {
        const sponsors = await Sponsor.find({ status: 'pending' }).populate('user');
        const kids = await Kid.find({ status: 'pending' }).populate('user');
        res.json({ sponsors, kids });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.approveApplication = async (req, res) => {
    const { type, id } = req.body; // type can be 'sponsor' or 'kid'
    try {
        const model = type === 'sponsor' ? Sponsor : Kid;
        const application = await model.findById(id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = 'approved';
        await application.save();
        res.json({ message: `${type} application approved` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.rejectApplication = async (req, res) => {
    const { type, id } = req.body; // type can be 'sponsor' or 'kid'
    try {
        const model = type === 'sponsor' ? Sponsor : Kid;
        const application = await model.findById(id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = 'rejected';
        await application.save();
        res.json({ message: `${type} application rejected` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.matchSponsorWithKids = async (req, res) => {
    const { sponsorId, kidIds } = req.body; // Array of kid IDs to match with the sponsor
    try {
        const sponsor = await Sponsor.findById(sponsorId);
        if (!sponsor || sponsor.status !== 'approved') {
            return res.status(400).json({ message: 'Invalid or unapproved sponsor' });
        }

        const kids = await Kid.find({ _id: { $in: kidIds }, status: 'approved' });
        if (kids.length !== kidIds.length) {
            return res.status(400).json({ message: 'Some kids are not approved or do not exist' });
        }

        const matches = kids.map((kid) => ({
            sponsor: sponsorId,
            kid: kid._id,
        }));

        await Matching.insertMany(matches);
        res.json({ message: 'Sponsor matched with kids successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMatches = async (req, res) => {
    try {
        const matches = await Matching.find()
            .populate({
                path: 'sponsor',
                populate: { path: 'user', select: 'name' } 
            })
            .populate({
                path: 'kid',
                populate: { path: 'user', select: 'name' } 
            });
        const formattedMatches = matches.map(match => ({
            sponsor: {
                name: match.sponsor?.user?.name || "N/A",
                signupDetails: match.sponsor?.signupDetails || {},
                status: match.sponsor?.status || "N/A"
            },
            kid: {
                name: match.kid?.user?.name || "N/A",
                age: match.kid?.age || "N/A",
                needs: match.kid?.needs || "N/A",
                status: match.kid?.status || "N/A"
            }
        }));

        res.json(formattedMatches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getAllSponsors = async (req, res) => {
    try {
        const sponsors = await Sponsor.find().populate('user');
        res.status(200).json(sponsors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllKids = async (req, res) => {
    try {
        const kids = await Kid.find().populate('user');
        res.status(200).json(kids);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

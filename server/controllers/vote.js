import Vote from "../models/Vote.js";

let io = null;
const setIo = (ioInstance) => {
    io = ioInstance;
};

// Helper to compute totals
const computeTotals = async () => {
    const agg = await Vote.aggregate([
        { $group: { _id: '$option', count: { $sum: 1 } } }
    ]);
    const totals = { 'Option A': 0, 'Option B': 0, 'Option C': 0 };
    agg.forEach((row) => {
        totals[row._id] = row.count;
    });
    return totals;
};

const postVote = async (req, res) => {
    try {
        // STEP 1: Get voter identity and their choice
        const voterSessionId = req.sessionID; // Like a unique voter ID
        const { option } = req.body; // The option they want to vote for

        // STEP 2: Check if this person already voted
        const existingVote = await Vote.findOne({ sessionId: voterSessionId });
        if (existingVote) {
            return res.status(400).json({ 
                message: '❌ You have already voted! Each person can only vote once.' 
            });
        }

        // STEP 3: Save the new vote to database
        const newVote = new Vote({ 
            sessionId: voterSessionId, 
            option: option 
        });
        await newVote.save();

        // STEP 4: Mark this session as "already voted"
        req.session.voted = true;
        req.session.option = option;

        // STEP 5: Calculate updated results
        const currentResults = await calculateVoteResults();
        
        // STEP 6: Send live update to all connected users
        if (io) {
            io.emit('voteUpdate', { 
                results: currentResults, 
                lastUpdated: new Date() 
            });
        }
        res.status(201).json({ 
            message: "✅ Vote recorded successfully!", 
            vote: newVote, 
            currentResults: currentResults 
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: '❌ You have already voted!' 
            });
        }
        res.status(500).json({ 
            message: "⚠️ Sorry, there was a problem recording your vote", 
            error: error.message 
        });
    }
}
const getVotes = async (req, res) => {
        try {
                const votes = await Vote.find();
                res.status(200).json(votes);
        } catch (error) {
                res.status(500).json({ message: "Error fetching votes", error: error.message });
        }
}

const getResults = async (req, res) => {
    try {
        const totals = await computeTotals();
        res.status(200).json({ totals, lastUpdated: new Date() });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
};

export { postVote, getVotes, getResults, setIo };
var mongoose = require('mongoose');

var Tournament = mongoose.model('Tournament', {
    id: { type: Number, index: true },
    hash: { type: String, index: true },
    title: String,
    currentBucket: { type: Number, default: 0 },
    type: String,
    rounds: [{
        id: Number,
        hash: String,
        games: [{
            id: Number,
            hash: String,
            game: [{type: String}],
            results: [{
                teamHash: String,
                score: Number
            }],
            scoredDate: { type: Date }
        }]
    }],
    buckets: [{
        type: String,
        number: Number,
        currentPieces: [{ type: Number, default: 0 }],
        pieces: [{
            type: String,
            number: Number,
            currentRound: { type: Number, default: 0 },
            rounds: [{
                type: String,
                number: Number,
            }]
        }]
    }],
    peopleInTeam: { type: Number, default: 1 }, // allowed params: 1, 2, 3
    description:  { type: String, default: '' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    location: { type: String, default: '' }
});

module.exports = Tournament;
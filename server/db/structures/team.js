var mongoose = require('mongoose');

var Team = mongoose.model('Team', {
    id: { type: Number, index: true },
    hash: { type: String, index: true },
    tournamentHash: { type: String, index: true },
    teamNumber: Number,
    poeple: [{
        firstName: String,
        lastName: String,
        image: String
    }],
    title: String,
    color: String,
    image: String,
    playWith: Array,
    gamesResults: [{
        points: Number,
        opponentPoints: Number,
        opponent: String,
        opponentFirstName: String,
        opponentLastName: String,
    }],
    points: Number,
    wins: Number,
    buhgolts: Number,
    isWinner: Boolean,
    isLooser: Boolean,
});

module.exports = Team;
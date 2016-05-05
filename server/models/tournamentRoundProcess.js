var tournamentDBModel = require('./../db/models/tournament');
var tournamentRoundProcessSwiss = require('./tournamentRoundProcessSwiss');

module.exports = {
    init: function (tournamentHash) {
        return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
            if (tournament.type === 'olympic') {
                return require('./tournamentRoundProcessOlympic');
            } else {
                return require('./tournamentRoundProcessSwiss');
            }
        });
    }
};
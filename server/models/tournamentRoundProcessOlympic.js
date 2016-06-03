var _ = require('lodash');
var helpers = require('./../helpers/functions');

function sortForRound(rounds, teams) {
    return teams;
}

function sortForImport(rounds, teams) {
    return teams;
}

function breakToGames(rounds, teams) {

    var winners = [];

    round = _.last(rounds);

    var isFinal = rounds.length >= 2 && rounds[rounds.length-1].games.length === 2 && rounds[rounds.length-2].games.length === 4;
    var loosers = [];

    if (rounds.length < 2 || rounds[rounds.length-1].games.length !== 2 || rounds[rounds.length-2].games.length !== 2) {
        if (round) {
            _.forEach(round.games, function(game) {
                if (game.results && game.results[0] && game.results[1] && game.results[0].teamHash && game.results[1].teamHash) {
                    var index = null;
                    var indexLooser = null;

                    if (game.results[0].score > game.results[1].score) {
                        index = 0;
                        indexLooser = 1;
                    } else if (game.results[0].score < game.results[1].score) {
                        index = 1;
                        indexLooser = 0;
                    }

                    if (!_.isNull(index)) {
                        var teamWinner = _.find(teams, {hash: game.results[index].teamHash});
                        if (teamWinner) {
                            winners.push(teamWinner);
                        }
                    }

                    if (!_.isNull(indexLooser)) {
                        var teamLooser = _.find(teams, {hash: game.results[indexLooser].teamHash});
                        if (teamLooser) {
                            loosers.push(teamLooser);
                        }
                    }
                }
            });
        } else {
            winners = teams;
        }

        var winnersHashes = _.map(winners, function(team) { return team.hash; });
        if (isFinal && loosers.length) {
            winnersHashes = winnersHashes.concat(_.map(loosers, function(team) { return team.hash; }));
        }

        if (winnersHashes.length > 1) {
            return _.chunk(winnersHashes, 2);
        }
    }

    return [];
}

module.exports = {
    sortForRound: sortForRound,
    breakToGames: breakToGames,
    sortForImport: sortForImport
}
var _ = require('lodash');
var helpers = require('./../helpers/functions');

function sortForRound(rounds, teams) {

    _.forEach(teams, function(team) {
        team.wins = 0;
    });

    _.forEach(rounds, function(round) {

        _.forEach(round.games, function(game) {

            if (game.results && game.results[0] && game.results[1] && game.results[0].teamHash && game.results[1].teamHash) {
                var index = null;
                if (game.results[0].score > game.results[1].score) {
                    index = 0;
                } else if (game.results[0].score < game.results[1].score) {
                    index = 1;
                }

                if (!_.isNull(index)) {
                    var teamWinner = _.find(teams, {hash: game.results[index].teamHash});
                    if (teamWinner)
                        teamWinner.wins++;
                }
            }

        });
    });

    teams = _.shuffle(teams);
    return _.orderBy(teams, ['wins'], ['asc']);
}

function sortForImport(rounds, teams) {

    _.forEach(teams, function(team) {
        team.wins = 0;
        team.buhgolts = 0;
        team.score = 0;
        team.playWith = [];
    });

    _.forEach(rounds, function(round) {

        _.forEach(round.games, function(game) {

            if (game.results && game.results[0] && game.results[1] && game.results[0].teamHash && game.results[1].teamHash) {
                var winnerIndex = null;
                var looserIndex = null;
                var scoreDiff = 0;
                if (game.results[0].score > game.results[1].score) {
                    winnerIndex = 0;
                    looserIndex = 1;
                    scoreDiff = game.results[0].score - game.results[1].score;
                } else if (game.results[0].score < game.results[1].score) {
                    winnerIndex = 1;
                    looserIndex = 0;
                    scoreDiff = game.results[1].score - game.results[0].score;
                }

                if (!_.isNull(winnerIndex)) {
                    var teamWinner = _.find(teams, {hash: game.results[winnerIndex].teamHash});
                    if (teamWinner) {
                        teamWinner.wins++;
                        teamWinner.playWith.push(game.results[looserIndex].teamHash);
                        teamWinner.score = teamWinner.score + scoreDiff;
                    }
                }

                if (!_.isNull(looserIndex)) {
                    var teamLooser = _.find(teams, {hash: game.results[looserIndex].teamHash});
                    if (teamLooser) {
                        teamLooser.playWith.push(game.results[winnerIndex].teamHash);
                        teamLooser.score = teamLooser.score - scoreDiff;
                    }
                }
            }

        });
    });

    _.forEach(teams, function(team) {

        team.buhgolts = _.sum(_.map(team.playWith, function(teamHash) {

            var oponent = _.find(teams, {hash: teamHash});
            if (oponent && oponent.wins) {
                return oponent.wins;
            }

            return 0;

        }));

    });

    return _.orderBy(teams, ['wins', 'buhgolts', 'score'], ['desc', 'desc', 'desc']);

}

function breakToGames(rounds, teams) {

    var gamesFlat = _.map(rounds, function(round) {
        return _.map(round.games, function(game) {
            return game.game;
        })
    });

    gamesFlat = _.flatten(gamesFlat);
    var playWith = _.map(gamesFlat, function(game) {
        var key = game[0];
        var value = game[1];
        var ret = {};
        ret[key] = value;
        return ret;
    })

    //console.log(_.map(teams, function(team) { var r = {}; r[team.hash] = team.wins; return r; }));
    var teamHashes = _.map(teams, function(team) { return team.hash; });
    var ret = treeChoises(teamHashes, playWith, 1, false);//_.chunk(teamHashes, 2);
    return ret;
}

function treeChoises(teams, playWith, level, isReadOnly) {

    var groups = [];
    var firstElement = _.head(teams);
    var tmpTeams;
    var isCompleted = false;

    tmpTeams = _.cloneDeep(teams);
    tmpTeams = _.slice(tmpTeams, 1);

    _.forEach(tmpTeams, function(nextElement, nextElementPosition) {

        if (!isCompleted) {

            var searchElement = {};
            searchElement[firstElement] = nextElement;
            var searchReversElement = {};
            searchReversElement[nextElement] = firstElement;

            if (!_.find(playWith, searchElement) && !_.find(playWith, searchReversElement)) {

                 tmpTeams.splice(nextElementPosition, 1);

                 if (_.size(tmpTeams) >= 2) {

                    subGroups = treeChoises(tmpTeams, playWith, level + 1, isReadOnly);
                    if (_.size(subGroups) > 0) {
                        groups = subGroups;
                        groups.push([firstElement, nextElement]);
                        isCompleted = true;
                    }

                } else {
                    groups.push([firstElement, nextElement]);
                    isCompleted = true;
                }

            }

        }

    });

    return groups;
}

module.exports = {
    sortForRound: sortForRound,
    breakToGames: breakToGames,
    sortForImport: sortForImport
}
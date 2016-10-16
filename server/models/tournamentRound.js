var tournamentDBModel = require('./../db/models/tournament');
var teamModel = require('./team');
var tournamentRoundProcessModel = require('./tournamentRoundProcess');
var gameModel = require('./game');
var autoincrementModel = require('./autoincrement');
var helpers = require('./../helpers/functions');

var _ = require('lodash');

var tournamentRoundAutoincrement = 'tournament.round:';
var tournamentGameAutoincrement = 'tournament.game:';

var tournamentRoundModel = {};
 _.assignIn(tournamentRoundModel, tournamentDBModel);

 /* extend model here */

tournamentRoundModel.getAll = function (tournamentHash) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        return tournament.rounds;
    });
};

tournamentRoundModel.getOneByHash = function (tournamentHash, roundHash) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        return _.find(tournament.rounds, {hash: roundHash});
    });
};

tournamentRoundModel.getLastOne = function (tournamentHash) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        var round = _.last(tournament.rounds);
        round.id = tournament.rounds.length;
        return round;
    });
};

tournamentRoundModel.getCount = function (tournamentHash) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        return tournament.rounds.length;
    });
};


// tournamentRoundModel.update = function (tournamentHash, roundHash, params) {
//     return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
//         var round = {};
//         var roundIndex = _.findIndex(tournament.rounds, {hash: roundHash});
//         if (roundIndex !== false) {
//             round = tournament.rounds[roundIndex];
//             _.assignIn(round, params);
//             tournament.rounds[index] = round;
//             return tournamentDBModel.updateByHash(tournamentHash, tournament).then(function () {
//                 return round;
//             });
//         }
//         return round;

//     });
// };

tournamentRoundModel.add = function (tournamentHash, params) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        return autoincrementModel.getNextSequence(tournamentRoundAutoincrement + tournamentHash).then(function(nextId) {
            params.id = nextId;
            params.hash = helpers.encodeHash(nextId);
            params.games = _.map(params.games, function(game, key) {
                if (_.isUndefined(game.id)) {
                    game.id = key+1;
                }
                if (_.isUndefined(game.hash)) {
                    game.hash = helpers.encodeHash(key + 1);
                }
                return game;
            });
            tournament.rounds.push(params);
            return tournamentDBModel.updateByHashAndGet.call(this, tournamentHash, tournament);
        });
    });
};

tournamentRoundModel.remove = function (tournamentHash, roundHash) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        if (tournament.rounds.length > 0) {
            _.pullAllBy(tournament.rounds, [{hash: roundHash}], 'hash');
            return tournamentDBModel.updateByHash(tournamentHash, tournament);
        } else {
            return false;
        }
    });
};

tournamentRoundModel.shuffle = function (tournamentHash) {

    return tournamentRoundProcessModel.init(tournamentHash)
        .then(function (tournamentProcessor) {

            return tournamentRoundModel.getAll(tournamentHash)
                .then(function (tournamentRounds) {

                    return teamModel.getAll(tournamentHash)
                        .then(tournamentProcessor.sortForRound.bind(null, tournamentRounds))
                        .then(tournamentProcessor.breakToGames.bind(null, tournamentRounds))
                        .then(gameModel.prepareList)
                        .then(function(games) {

                            if (games.length) {

                                return tournamentRoundModel
                                    .add(tournamentHash, {games: games})
                                    .then(function (tournament) {

                                        var round = _.last(tournament.rounds);
                                        round.id = tournament.rounds.length;
                                        return gameModel.incrementIndex(round.hash, games.length)
                                            .then(function () {
                                                return round;
                                            });

                                    });

                            } else {
                                return Promise.reject('We don\'t have any options to shuffle teams.');
                            }

                        }).catch(function(err) {
                            console.log(err);
                        });

                }).catch(function(err) {
                    console.log(err);
                });
        }).catch(function(err) {
            console.log(err);
        });
}

tournamentRoundModel.importTeams = function (tournamentHash, importTeamsFrom, importTeamsPlaces) {

    return tournamentRoundProcessModel.init(importTeamsFrom)
        .then(function (tournamentProcessor) {

            return tournamentRoundModel.getAll(importTeamsFrom)
                .then(function (tournamentRounds) {

                    return teamModel.getAll(importTeamsFrom)
                        .then(tournamentProcessor.sortForImport.bind(null, tournamentRounds))
                        .then(function(teams) {

                            var teamsSorted = _.map(teams, function (team) { return _.pick(team, ['title', 'wins', 'buhgolts', 'score']) } );

                            _.forEach(importTeamsPlaces, function(place) {

                                var currentPlace = _.toNumber(place) - 1;

                                if (teamsSorted[currentPlace]) {
                                    teamModel.add(tournamentHash, _.pick(teamsSorted[currentPlace], ['title']));
                                }

                            });

                            return true;

                        }).catch(function(error) {
                            console.log(error);
                        });

                }).catch(function(error) {
                    console.log(error);
                });
        }).catch(function(error) {
            console.log(error);
        });

}

module.exports = {
    getAll: tournamentRoundModel.getAll,
    getOne: tournamentRoundModel.getOneByHash,
    getLastOne: tournamentRoundModel.getLastOne,
    getCount: tournamentRoundModel.getCount,
    // update: tournamentRoundModel.update,
    add: tournamentRoundModel.add,
    remove: tournamentRoundModel.remove,
    shuffle: tournamentRoundModel.shuffle,
    importTeams: tournamentRoundModel.importTeams
};
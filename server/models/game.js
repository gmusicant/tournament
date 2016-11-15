var _ = require('lodash');
var helpers = require('./../helpers/functions');
var autoincrementModel = require('./autoincrement');
var tournamentDBModel = require('./../db/models/tournament');

var tournamentGameAutoincrement = 'tournament.game:';

var gameModel = {};
 _.extend(gameModel, tournamentDBModel);


gameModel.getAll = function (tournamentHash) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        return tournament.rounds;
    });
};

gameModel.getOne = function (tournamentHash) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        return tournament.rounds;
    });
};

// gameModel.add = function (tournamentHash) {
//     return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
//         return tournament.rounds;
//     });
// };

gameModel.update = function (tournamentHash) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        return tournament.rounds;
    });
};

// gameModel.remove = function (tournamentHash) {
//     return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
//         return tournament.rounds;
//     });
// };

gameModel.prepareList = function (games) {
    games = _.map(games, function (game, index) {
        return {
            id: index + 1,
            hash: helpers.encodeHash(index + 1),
            game: game
        }
    });
    return Promise.resolve(games);
}

gameModel.incrementIndex = function (roundHash, count) {
    return autoincrementModel
        .getNextSequence(tournamentGameAutoincrement + roundHash, count);
}

module.exports = {
    getAll: gameModel.getAll,
    getOne: gameModel.getOne,
    // add: gameModel.add,
    update: gameModel.update,
    // remove: gameModel.remove,
    prepareList: gameModel.prepareList,
    incrementIndex: gameModel.incrementIndex
}
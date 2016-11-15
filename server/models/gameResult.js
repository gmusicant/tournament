var _ = require('lodash');
var tournamentDBModel = require('./../db/models/tournament');

var gameResultModel = {};
 _.extend(gameResultModel, tournamentDBModel);

function formatGameResult(game) {
    var results = {};

    _.forEach(game.game, function(teamHash) {
        results[teamHash] = null;
    });

    var ret = {
        hash: game.hash,
        scoredDate: game.scoredDate,
        results: results
    };

    _.forEach(game.results, function(result) {
        ret.results[result.teamHash] = result.score;
    });
    return ret;
}

gameResultModel.getAll = function (tournamentHash, roundHash) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        var round = _.find(tournament.rounds, {hash: roundHash})
        if (round) {
            return _.map(round.games, function(game) {
                return formatGameResult(game);
            });
        }
        return [];

    });
};

gameResultModel.getOne = function (tournamentHash, roundHash, gameHash) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        var round = _.find(tournament.rounds, {hash: roundHash})
        if (round) {
            var game = _.find(round.games, {hash: gameHash});
            if (game) {
                return formatGameResult(game);
            }
        }
        return [];
    });
};

gameResultModel.add = function (tournamentHash, roundHash, gameHash, results) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        var round = _.find(tournament.rounds, {hash: roundHash})
        if (round) {
            var game = _.find(round.games, {hash: gameHash});
            if (game) {
                game.scoredDate = Date.now();
                game.results = _.map(results, function(value, key) {
                    return {
                        teamHash: key,
                        score: value
                    }
                });
                return tournamentDBModel.updateByHash.call(this, tournamentHash, tournament).then(function() {
                    return formatGameResult(game);
                });
            }
        }
        return [];
    });
};

gameResultModel.update = function (tournamentHash, roundHash, gameHash, results) {
    return gameResultModel.add(tournamentHash, roundHash, gameHash, results);
};

gameResultModel.remove = function (tournamentHash, roundHash, gameHash) {
    return tournamentDBModel.getOneByHash(tournamentHash).then(function(tournament) {
        var round = _.find(tournament.rounds, {hash: roundHash})
        if (round) {
            var game = _.find(round.games, {hash: gameHash});
            if (game) {
                game.scoredDate = Date.now();
                game.results = [];
                return tournamentDBModel.updateByHashAndGet.call(this, tournamentHash, tournament);
            }
        }
        return [];
    });
};

module.exports = {
    formatGameResult: formatGameResult,
    getAll: gameResultModel.getAll,
    getOne: gameResultModel.getOne,
    add: gameResultModel.add,
    update: gameResultModel.update,
    remove: gameResultModel.remove
}
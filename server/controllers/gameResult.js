var requests = require('../helpers/requests');
var gameResultModel = require('../models/gameResult');

module.exports = {

    getList: function (req, res) {
        gameResultModel.getAll(req.params.tournamentHash, req.params.tournamentRoundHash).then(function(games) {
            requests.resultSuccess(res, {games: games});
        });
    },

    getOne: function (req, res) {
        gameResultModel.getOne(req.params.tournamentHash, req.params.tournamentRoundHash, req.params.gameHash).then(function(game) {
            requests.resultSuccess(res, {game: game});
        });
    },

    post: function (req, res) {
        gameResultModel.add(req.params.tournamentHash, req.params.tournamentRoundHash, req.params.gameHash, req.body).then(function (game) {
            requests.resultSuccess(res, {game: game});
        });
    },

    put: function (req, res) {
        gameResultModel.update(req.params.tournamentHash, req.params.tournamentRoundHash, req.params.gameHash, req.body).then(function(game) {
            requests.resultSuccess(res, {game: game});
        });
    },

    delete: function (req, res) {
        gameResultModel.remove(req.params.tournamentHash, req.params.tournamentRoundHash, req.params.gameHash).then(function() {
            requests.resultSuccess(res);
        });
    }

}
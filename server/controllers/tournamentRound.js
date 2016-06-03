var requests = require('../helpers/requests');
var tournamentRoundModel = require('../models/tournamentRound');

module.exports = {

    getList: function (req, res) {
        tournamentRoundModel.getAll(req.params.tournamentHash).then(function(tournamentRounds) {
            requests.resultSuccess(res, {tournamentRounds: tournamentRounds});
        });
    },

    getOne: function (req, res) {
        tournamentRoundModel.getOne(req.params.tournamentHash, req.params.tournamentRoundHash).then(function(tournamentRound) {
            requests.resultSuccess(res, {tournamentRound: tournamentRound});
        });
    },

    getLastOne: function (req, res) {
        tournamentRoundModel.getLastOne(req.params.tournamentHash).then(function(tournamentRound) {
            requests.resultSuccess(res, {tournamentRound: tournamentRound});
        });
    },

    post: function (req, res) {
        tournamentRoundModel.add(req.params.tournamentHash, req.body).then(function (tournamentRound) {
                requests.resultSuccess(res, {tournamentRound: tournamentRound});
        });
    },

    shuffle: function (req, res) {
        tournamentRoundModel.shuffle(req.params.tournamentHash).then(function(tournamentRound) {
            requests.resultSuccess(res, {tournamentRound: tournamentRound});
        });
    },

    importTeams: function(req, res) {
        tournamentRoundModel.importTeams(req.params.tournamentHash, req.body.importTeamsFrom, req.body.importTeamsPlaces).then(function() {
            requests.resultSuccess(res);
        });
    },

    // put: function (req, res) {
    //     tournamentRoundModel.update(req.params.tournamentHash, req.params.tournamentRoundHash, req.body).then(function(tournamentRound) {
    //         requests.resultSuccess(res, {tournamentRound: tournamentRound});
    //     });
    // },

    delete: function (req, res) {
        tournamentRoundModel.remove(req.params.tournamentHash, req.params.tournamentRoundHash).then(function() {
            requests.resultSuccess(res);
        });
    }

}
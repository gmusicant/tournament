var requests = require('../helpers/requests');
var tournamentModel = require('../models/tournament');

module.exports = {

    getList: function (req, res) {
        tournamentModel.getAll().then(function(tournaments) {
            requests.resultSuccess(res, {tournaments: tournaments});
        });
    },

    getOne: function (req, res) {
        tournamentModel.getOne(req.params.tournamentHash).then(function(tournament) {
            requests.resultSuccess(res, {tournament: tournament});
        });
    },

    post: function (req, res) {
        tournamentModel.add(req.body).then(function(tournament) {
            requests.resultSuccess(res, {tournament: tournament});
        });
    },

    put: function (req, res) {
        tournamentModel.update(req.params.tournamentHash, req.body).then(function(tournament) {
            requests.resultSuccess(res, {tournament: tournament});
        });
    },

    delete: function (req, res) {
        tournamentModel.remove(req.params.tournamentHash).then(function() {
            requests.resultSuccess(res);
        });
    }

}
var requests = require('../helpers/requests');
var teamModel = require('../models/team');

module.exports = {

    getList: function (req, res) {
        teamModel.getAll(req.params.tournamentHash).then(function(teams) {
            requests.resultSuccess(res, {teams: teams});
        });
    },

    getOne: function (req, res) {
        teamModel.getOne(req.params.tournamentHash, req.params.teamHash).then(function(team) {
            requests.resultSuccess(res, {team: team});
        });
    },

    post: function (req, res) {
        teamModel.add(req.params.tournamentHash, req.body).then(function(team) {
            requests.resultSuccess(res, {team: team});
        });
    },

    put: function (req, res) {
        teamModel.update(req.params.tournamentHash, req.params.teamHash, req.body).then(function(team) {
            requests.resultSuccess(res, {team: team});
        });
    },

    delete: function (req, res) {
        teamModel.remove(req.params.tournamentHash, req.params.teamHash).then(function() {
            requests.resultSuccess(res);
        });
    }

}
var _ = require('lodash');

var Team = require('./../structures/team');
var TeamModelGeneric = require('./generic')(Team);

/* extend model here */

var TeamModel = {};
 _.extend(TeamModel, TeamModelGeneric);

TeamModel.getAll = function(tournamentHash) {
    return TeamModelGeneric.getAll({tournamentHash: tournamentHash});
};

TeamModel.getOneByHash = function(tournamentHash, teamHash) {
    return TeamModelGeneric.getOne({tournamentHash: tournamentHash, hash: teamHash});
};

TeamModel.removeByHash = function(tournamentHash, teamHash) {
    return TeamModelGeneric.remove({tournamentHash: tournamentHash, hash: teamHash});
};

TeamModel.updateByHash = function(tournamentHash, teamHash, params) {
    return TeamModelGeneric.update({tournamentHash: tournamentHash, hash: teamHash}, params);
};

TeamModel.updateByHashAndGet = function(tournamentHash, teamHash, params) {
    return TeamModelGeneric.update({tournamentHash: tournamentHash, hash: teamHash}, params).then(function() {
        return TeamModel.getOneByHash(tournamentHash, teamHash);
    }).catch(function (err) {
        console.log(err);
    });
};

exports = module.exports = TeamModel;
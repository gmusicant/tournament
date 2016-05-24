var teamDBModel = require('./../db/models/team');
var autoincrementModel = require('./autoincrement');
var tournamentModel = require('./tournament');
var helpers = require('./../helpers/functions');

var _ = require('lodash');

var teamAutoincrement = 'team';
var teamAutoincrementInTournament = 'team.tournament:';

var teamModel = {};
 _.assignIn(teamModel, teamDBModel);

/* extend model here */

teamModel.getAll = function(tournamentHash) {
    return teamDBModel.getAll(tournamentHash).then(function(teams) {
        _.forEach(teams, function(team) {
            if (_.isUndefined(team.active)) {
                team.active = true;
            }
        });
        return teams;
    })
}

teamModel.add = function (tournamentHash, params) {
    return autoincrementModel.getNextSequence(teamAutoincrement).then(function (nextId) {
        return autoincrementModel.getNextSequence(teamAutoincrementInTournament + tournamentHash).then(function (nextTeamId) {
            params.id = nextId;
            params.hash = helpers.encodeHash(nextId);
            params.tournamentHash = tournamentHash;
            params.teamNumber = nextTeamId;
            return teamDBModel.add.call(this, params);
        });
    });
};

teamModel.addPerson = function(tournamentHash, teamHash, personData) {
    return teamDBModel.getOneByHash(tournamentHash, teamHash).then(function(team) {
        if (_.isUndefined(team.people))
            team.people = [];
        team.people.push(personData);
        return teamDBModel.updateByHashAndGet(tournamentHash, teamHash, team);
    });
}

teamModel.removePerson = function(tournamentHash, teamHash, personData) {
    return teamDBModel.getOneByHash(tournamentHash, teamHash).then(function(team) {
        if (_.isUndefined(team.people))
            team.people = [];
        var index = _.findIndex(team.people, personData);
        if (index !== false) {
            team.people.slice(index, 1);
            return teamDBModel.updateByHashAndGet(tournamentHash, teamHash, team);
        } else {
            return team;
        }
    });
}

teamModel.removeByHash = function(tournamentHash, teamHash) {
    return tournamentModel.getOne(tournamentHash).then(function (tournament) {
        if (!tournament || !tournament.rounds || tournament.rounds.length === 0) {
            return teamDBModel.removeByHash(tournamentHash, teamHash);
        } else {
            return teamDBModel.updateByHash(tournamentHash, teamHash, {active: false});
        }
    });
}

teamModel.getImages = function(tournamentHash, teamHash) {
    return teamDBModel.getOneByHash(tournamentHash, teamHash).then(function(team) {
        var images = [];
        if (team.image) {
            images.push(team.image);
        } else {
            _.forEach(team.people, function(person) {
                if (person.image) {
                    images.push(person.image);
                }
            });
        }
        return images;
    });
}


module.exports = {
    getAll: teamModel.getAll,
    getOne: teamModel.getOneByHash,
    update: teamModel.updateByHashAndGet,
    add: teamModel.add,
    remove: teamModel.removeByHash,
    addPerson: teamModel.addPerson,
    removePerson: teamModel.removePerson,
    getImages: teamModel.getImages
};
var _ = require('lodash');
var mongoose = require('mongoose');



var Team = mongoose.model('Person', {
    firstName: String,
    lastName: String,
    color: String,
    image: String,
    playWith: Array,
    gamesResults: [{
        points: Number,
        opponentPoints: Number,
        opponent: String,
        opponentFirstName: String,
        opponentLastName: String,
    }],
    points: Number,
    wins: Number,
    buhgolts: Number,
    isWinner: Boolean,
    isLooser: Boolean,
    tournamentHash: { type: String, index: true }
});



function getAll(tournamentHash) {
    return new Promise(function (res, rej) {
        Team.find({tournamentHash: tournamentHash}, function(err, people) {
            if (err)
                rej(err);

            _.forEach(people, function(person, num) {
                person.color = !_.isUndefined(person.color) ? person.color : '#ffffff';
                person.image = !_.isUndefined(person.image) ? person.image : '';
                person.positionNumber = (person.firstName) ? person.firstName.substring(0,2).trim() : 0;
            });

            people.sort(function(a,b) {
                return a.positionNumber - b.positionNumber;
            });

            res(people);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function get(id) {
    return new Promise(function (res, rej) {
        Team.findOne({_id: id}, function(err, team) {
            if (err)
                rej(err);
            res(team);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function add(params) {
    return new Promise(function (res, rej) {
        var team = new Team();
        team = _.assignIn(team, params);
        Team.create(team, function(err, team) {
            if (err)
                rej(err);
            res(team);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function remove(id) {
    return new Promise(function (res, rej) {
        var team = Team.where({_id: id});
        Team.remove(team, function(err, data) {
            if (err)
                rej(err);
            res(true);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function update(id, params) {
    return new Promise(function (res, rej) {
        Team.where({_id: id}).update(params, function (err, team) {
            if (err)
                rej(err);
            res(true);
        });
    }).catch(function (err) {
        console.log(err);
    });
}


exports = module.exports = {
    getAll: getAll,
    get: get,
    add: add,
    remove: remove,
    update: update
}
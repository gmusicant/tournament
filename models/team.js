var _ = require('lodash');
var mongoose = require('mongoose');


var DB_USERNAME = process.env.DB_USERNAME || require('./../constants').DB_USERNAME;
var DB_PASSWORD = process.env.DB_PASSWORD || require('./../constants').DB_PASSWORD;
var DB_URI = 'mongodb://'+ DB_USERNAME +':'+ DB_PASSWORD +'@ds013559.mlab.com:13559/tornament';



var Team = mongoose.model('Person', {
    firstName: String,
    lastName: String,
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
    isLooser: Boolean
});




function getAll() {
    return new Promise(function (res, rej) {
        Team.find(function(err, people) {
            if (err)
                rej(err);
            res(people);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function get(id) {
    return new Promise(function (res, rej) {
        Team.find({_id: id}, function(err, team) {
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
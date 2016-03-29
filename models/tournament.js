var _ = require('lodash');
var mongoose = require('mongoose');
var encodeHash = new require('../helpers/functions').encodeHash;
var decodeHash = new require('../helpers/functions').decodeHash;

var autoincrementModel = require('./autoincrement');



var Tournament = mongoose.model('Tournament', {
    id: { type: Number, index: true },
    hash: { type: String, index: true },
    title: String,
    description: String,
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    location: String
});



function getAll() {
    return new Promise(function (res, rej) {
        Tournament.find(function(err, tournaments) {
            if (err)
                rej(err);
            res(tournaments);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function get(hash) {
    return new Promise(function (res, rej) {
        Tournament.findOne({hash: hash}, function(err, tournament) {
            if (err)
                rej(err);
            res(tournament);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function add(params) {
    return new Promise(function (res, rej) {
        autoincrementModel.getNextSequence('tournament').then(function (id) {
            var tournament = new Tournament();
            tournament.id = id;
            tournament.hash = encodeHash(id);
            tournament = _.assignIn(tournament, params);
            Tournament.create(tournament, function(err, tournament) {
                if (err)
                    rej(err);
                res(tournament);
            });
        });

    }).catch(function (err) {
        console.log(err);
    });
}

function remove(hash) {
    return new Promise(function (res, rej) {
        var tournament = Tournament.where({hash: hash});
        Tournament.remove(tournament, function(err, data) {
            if (err)
                rej(err);
            res(true);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function update(hash, params) {
    return new Promise(function (res, rej) {
        Tournament.where({hash: hash}).update(params, function (err, tournament) {
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
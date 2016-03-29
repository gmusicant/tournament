var _ = require('lodash');
var mongoose = require('mongoose');



var Group = mongoose.model('Group', {
    group: Array,
    tournamentHash: { type: String, index: true }
});




function getAll(tournamentHash) {
    return new Promise(function (res, rej) {
        Group.find({tournamentHash: tournamentHash}, function(err, groups) {
            if (err)
                rej(err);
            res(groups);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function add(params) {
    return new Promise(function (res, rej) {
        var group = new Group();
        group = _.assignIn(group, params);
        Group.create(group, function(err, group) {
            if (err)
                rej(err);
            res(group);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function removeAll(tournamentHash) {
    return getAll(tournamentHash).then(function (groups) {

        return Promise.all(_.map(groups, function (group) {
            return new Promise(function (resBelow, rejBelow) {
                Group.remove(group, function(err, data) {
                    if (err)
                        rejBelow(err);
                    resBelow(true);
                });
            });
        })).then(function() {
            return true;
        });
    }).catch(function (err) {
        console.log(err);
    });
}

exports = module.exports = {
    getAll: getAll,
    add: add,
    removeAll: removeAll
}
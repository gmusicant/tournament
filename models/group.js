var _ = require('lodash');
var mongoose = require('mongoose');


var DB_USERNAME = process.env.DB_USERNAME || require('./../constants').DB_USERNAME;
var DB_PASSWORD = process.env.DB_PASSWORD || require('./../constants').DB_PASSWORD;
var DB_URI = 'mongodb://'+ DB_USERNAME +':'+ DB_PASSWORD +'@ds013559.mlab.com:13559/tornament';





var Group = mongoose.model('Group', {
    group: Array
});




function getAll() {
    return new Promise(function (res, rej) {
        Group.find(function(err, groups) {
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

function removeAll() {
    return getAll().then(function (groups) {

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
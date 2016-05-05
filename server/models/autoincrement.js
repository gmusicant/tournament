var autoincrementDBModel = require('./../db/models/autoincrement');

var _ = require('lodash');

function init(name) {
    return new Promise(function (res, rej) {
        autoincrementDBModel.count({_id: name}).then(function (count) {
            if (count === 0) {
                autoincrementDBModel.add({
                  _id: name,
                  seq: 0
                }).then(function() {
                    res(true);
                });
            } else {
                res(true);
            }
        });
    });
}

function getNextSequence(name, count) {
     if (_.isUndefined(count))
        count = 1;
    return init(name).then(function() {
        return new Promise(function (res, rej){
            res(autoincrementDBModel.incSequence(name, count));
        });
    }).catch(function (err) {
        console.log(err);
    });
}

exports = module.exports = {
    getNextSequence: getNextSequence
}
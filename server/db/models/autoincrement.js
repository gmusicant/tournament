
var Autoincrement = require('./../structures/autoincrement');
var AutoincrementModel = require('./generic')(Autoincrement);

var _ = require('lodash');

AutoincrementModel.incSequence = function(name, count) {
    if (_.isUndefined(count))
        count = 1;
    return new Promise(function (res, rej) {
        Autoincrement.findAndModify.call(Autoincrement,
            { _id: name },
            { $inc: { seq: count } },
            { new: true },
            res
        );
    });
}

module.exports = AutoincrementModel;
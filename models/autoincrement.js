var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var AutoincrementSchema = new Schema({
    _id: String,
    seq: Number
});

AutoincrementSchema.statics.findAndModify = function (query, doc, options, callback) {
    return this.collection.findAndModify(query, {}, doc, options, function (err, counter) {
        if (err) throw err;
        callback(counter.value.seq);
    });
};

var Autoincrement = mongoose.model('Autoincrement', AutoincrementSchema);

function init(name) {
    return new Promise(function (res, rej) {
        Autoincrement.count({_id: name}, function (err, count){
            if (count === 0) {
                Autoincrement.create({
                  _id: name,
                  seq: 0
                }, function(err, doc) {
                    res(true);
                });
            } else {
                res(true);
            }
        });
    });
}

function getNextSequence(name) {
    return init(name).then(function() {
        return new Promise(function (res, rej){
            Autoincrement.findAndModify(
                { _id: name },
                { $inc: { seq: 1 } },
                { new: true },
                res
            );
        });
    }).catch(function (err) {
        console.log('eeee', err);
    });
}


exports = module.exports = {
    init: init,
    getNextSequence: getNextSequence
}
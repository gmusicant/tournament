var mongoose = require('mongoose');

var AutoincrementSchema = new mongoose.Schema({
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

module.exports = Autoincrement;
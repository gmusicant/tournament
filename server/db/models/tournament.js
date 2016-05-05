var Tournament = require('./../structures/tournament');
var TournamentModel = require('./generic')(Tournament);

/* extend model here */

TournamentModel.getOneByHash = function(hash) {
    return TournamentModel.getOne({hash: hash});
};

TournamentModel.removeByHash = function(hash) {
    return TournamentModel.remove({hash: hash});
};

TournamentModel.updateByHash = function(hash, params) {
    return TournamentModel.update({hash: hash}, params);
};

TournamentModel.updateByHashAndGet = function(hash, params) {
    return TournamentModel.update({hash: hash}, params).then(function() {
        return TournamentModel.getOneByHash(hash);
    }).catch(function (err) {
        console.log(err);
    });
};

exports = module.exports = TournamentModel;
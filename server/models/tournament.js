var tournamentDBModel = require('../db/models/tournament');
var autoincrementModel = require('./autoincrement');
var helpers = require('../helpers/functions');

var _ = require('lodash');

var tournamentAutoincrement = 'tournament';

var tournamentModel = {};
 _.assignIn(tournamentModel, tournamentDBModel);

 /* extend model here */

tournamentModel.add = function (params) {
    return autoincrementModel.getNextSequence(tournamentAutoincrement).then(function(nextId) {
        params.id = nextId;
        params.hash = helpers.encodeHash(nextId);
        return tournamentDBModel.add.call(this, params);
    });
};

// tournamentModel.getBuckedAutoincrementHash = function (tournamentHash) {
//     return tournamentAutoincrement + '.bucket:' + tournamentHash;
// };

// tournamentModel.getPieceAutoincrementHash = function (tournamentHash, bucket) {
//     return tournamentAutoincrement + '.piece:' + tournamentHash + ':bucket:' + bucket;
// };

// tournamentModel.getRoundAutoincrementHash = function (tournamentHash, bucket, piece) {
//     return tournamentAutoincrement + '.round:' + tournamentHash + ':bucket:' + bucket + ':piece:' + piece;
// };

// tournamentModel.addBucket = function (tournamentHash, params) {
//     return tournamentModel.getOneByHash(tournamentHash).then(function (tournament) {
//         return autoincrementModel
//             .getNextSequence(tournamentModel.getBuckedAutoincrementHash(tournamentHash))
//             .then(function(bucketId) {
//                 params.number = bucketId;
//                 tournament.currentBucket = bucketId;
//                 tournament.buckets.push(params);
//                 return tournamentModel.updateByHashAndGet(tournamentHash, tournament);
//             });

//     });
// };

// tournamentModel.getTeamModel = function (type) {
//     switch (type) {
//         case 'duplet':
//             return require('teamDuplet');
//         case 'triplet':
//             return require('teamTriplet');
//         case 'tet':
//         default:
//             return require('teamTet');
//     }
// }

module.exports = {
    getAll: tournamentModel.getAll.bind(tournamentModel, {}),
    getOne: tournamentModel.getOneByHash,
    update: tournamentModel.updateByHashAndGet,
    add: tournamentModel.add,
    // addBucket: tournamentModel.addBucket,
    remove: tournamentModel.removeByHash
};
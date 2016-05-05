var _ = require('lodash');
var fs = require('fs');
var hashids = new require('hashids')('anton123123', 3, 'qwertyuiopasdfghjklzxcvbnm1234567890');

function treeChoises(collection, platWith, level, isReadOnly) {

    var groups = [];
    var firstElement = _.head(collection);
    var tmpCollection;
    var isCompleted = false;

    collection = _.slice(collection, 1);

    _.forEach(collection, function(nextElement, nextElementPosition) {

        if (!isCompleted) {

            tmpCollection = _.slice(collection, 0);

            if (firstElement.playWith.indexOf(nextElement.id) === -1) {

                 tmpCollection.splice(nextElementPosition, 1);

                 if (_.size(tmpCollection) >= 2) {

                    subGroups = treeChoises(_.slice(tmpCollection, 0), platWith, level + 1, isReadOnly);
                    if (_.size(subGroups) > 0) {
                        groups = subGroups;
                        groups.push([firstElement.id, nextElement.id]);
                        isCompleted = true;
                    }

                } else {
                    groups.push([firstElement.id, nextElement.id]);
                    isCompleted = true;
                }

            }

        }

    });

    return groups;
}

function prepareRenderConstructor() {

    this.timer = [];
    this.getRender = function(data, req) {

        if (_.isUndefined(data))
            data = {};

        if (_.isUndefined(data.isEditMode))
            data.isEditMode = data.isEditMode = req && req.cookies && req.cookies.user && req.cookies.user.type === 'admin';
        if (_.isUndefined(data.isSuperEdit))
            data.isSuperEdit = false;
        if (_.isUndefined(data.isLogin))
            data.isLogin = req && req.cookies && req.cookies.user && req.cookies.user && req.cookies.user.type && req.cookies.user.type !== 'none';

        if (_.isUndefined(data.tournamentHash)) {

            if (req && req.params && req.params.tournamentHash) {
                data.tournamentHash = req.params.tournamentHash;
            } else if (req && req.cookies && req.cookies.tournamentHash) {
                data.tournamentHash = req.cookies.tournamentHash;
            } else {
                data.tournamentHash = '';
            }

        }

        if (_.isUndefined(this.timer[data.tournamentHash]))
            this.timer[data.tournamentHash] = new Date();

        data.timer = (new Date()).getTime() - this.timer[data.tournamentHash].getTime();
        return data;
    };

    return this;
}

function encodeHash(id) {
    return hashids.encode(id);
}

function decodeHash(hash) {
    return hashids.decode(hash);
}

exports = module.exports = {
    treeChoises: treeChoises,
    prepareRenderConstructor: prepareRenderConstructor,
    encodeHash: encodeHash,
    decodeHash: decodeHash
}
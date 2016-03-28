var _ = require('lodash');
var fs = require('fs');

function treeChoises(collection, level, isReadOnly) {

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

                        subGroups = treeChoises(_.slice(tmpCollection, 0), level + 1);
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

exports = module.exports = {
    treeChoises: treeChoises
}
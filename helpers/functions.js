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
                            firstElement.playWith.push(nextElement.id);
                            nextElement.playWith.push(firstElement.id);
                            groups.push([firstElement, nextElement]);
                            isCompleted = true;

                        }

                    } else {
                        firstElement.playWith.push(nextElement.id);
                        nextElement.playWith.push(firstElement.id);
                        groups.push([firstElement, nextElement]);
                        isCompleted = true;
                    }

                }

            }

        });

        return groups;
    }

    function saveDB(DB_PATH, DB_COLLECTION_NAME, variable) {
        fs.writeFileSync(DB_PATH + DB_COLLECTION_NAME + '.json', JSON.stringify(variable), 'utf-8');
    }

    function loadDB(DB_PATH, DB_COLLECTION_NAME) {
        return JSON.parse(fs.readFileSync(DB_PATH + DB_COLLECTION_NAME + '.json', 'utf-8'));
    }

exports = module.exports = {
    treeChoises: treeChoises,
    saveDB: saveDB,
    loadDB: loadDB
}
var _ = require('lodash');

function GenericConstructor(schema) {

    this.getAll = function(where) {
        if (_.isUndefined(where))
            where = {};
        return new Promise(function (res, rej) {
            schema.find(where, function(err, results) {
                if (err)
                    rej(err);
                res(results);
            });
        }).catch(function (err) {
            console.log(err);
        });
    };

    this.getOne = function(where) {
        return new Promise(function (res, rej) {
            schema.findOne(where, function(err, result) {
                if (err)
                    rej(err);
                res(result);
            });
        }).catch(function (err) {
            console.log(err);
        });
    };

    this.add = function(params) {
        return new Promise(function (res, rej) {
            schema.create(params, function(err, result) {
                if (err)
                    rej(err);
                res(result);
            });
        }).catch(function (err) {
            console.log(err);
        });
    };

    this.remove = function(where) {
        return new Promise(function (res, rej) {
            var result = schema.where(where);
            schema.remove(result, function(err, data) {
                if (err)
                    rej(err);
                res(true);
            });
        }).catch(function (err) {
            console.log(err);
        });
    };

    this.update = function(where, params) {
        return new Promise(function (res, rej) {
            schema.where(where).update(params, function (err, result) {
                if (err)
                    rej(err);
                res(true);
            });
        }).catch(function (err) {
            console.log(err);
        });
    };

    this.count = function(where) {
        if (_.isUndefined(where))
            where = {};
        return new Promise(function (res, rej) {
            schema.count(where, function(err, result) {
                if (err)
                    rej(err);
                res(result);
            });
        }).catch(function (err) {
            console.log(err);
        });
    };

}

exports = module.exports = function (schema) {
    return new GenericConstructor(schema);
};
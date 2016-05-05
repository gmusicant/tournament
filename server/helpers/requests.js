var _ = require('lodash');

module.exports = {

    resultSuccess: function(res, json) {
        if (_.isUndefined(json))
            json = {};
        json.success = true;
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(json));
    }

}

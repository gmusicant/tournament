var requests = require('../helpers/requests');

var data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];

module.exports = {

    index: function (req, res) {
        res.render('index', {reactHtml: ''});
    },

    redirectToIndex: function(req, res) {
        res.redirect('/client');
    },

    comments: function(req, res) {
        requests.resultSuccess(res, data);
    },

    commentsPost: function(req, res) {
        data.push(req.body);
        res.redirect('/api/comments');
    }
}
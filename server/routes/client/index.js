var express = require('express');
var controller = require('../../controllers/index');

var AppRouter = express.Router();

AppRouter.route('/client')
    .get(controller.index);

AppRouter.route('/client/*')
    .get(controller.index);


AppRouter.route('/')
    .get(controller.redirectToIndex);

AppRouter.route('/api/comments')
    .get(controller.comments);

AppRouter.route('/api/comments')
    .post(controller.commentsPost);


module.exports = AppRouter;
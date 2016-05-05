var express = require('express');
var controller = require('../../controllers/tournament');

var AppRouter = express.Router();

AppRouter.route('/server/tournament')
    .get(controller.getList);

AppRouter.route('/server/tournament/:tournamentHash')
    .get(controller.getOne);

AppRouter.route('/server/tournament')
    .post(controller.post);

AppRouter.route('/server/tournament/:tournamentHash')
    .put(controller.put);

AppRouter.route('/server/tournament/:tournamentHash')
    .delete(controller.delete);

module.exports = AppRouter;
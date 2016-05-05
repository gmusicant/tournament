var express = require('express');
var controller = require('../../controllers/team');

var AppRouter = express.Router();

AppRouter.route('/server/tournament/:tournamentHash/team')
    .get(controller.getList);

AppRouter.route('/server/tournament/:tournamentHash/team/:teamHash')
    .get(controller.getOne);

AppRouter.route('/server/tournament/:tournamentHash/team')
    .post(controller.post);

AppRouter.route('/server/tournament/:tournamentHash/team/:teamHash')
    .put(controller.put);

AppRouter.route('/server/tournament/:tournamentHash/team/:teamHash')
    .delete(controller.delete);

module.exports = AppRouter;
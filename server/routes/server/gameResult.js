var express = require('express');
var controller = require('../../controllers/gameResult');

var AppRouter = express.Router();

AppRouter.route('/server/tournament/:tournamentHash/tournamentRound/:tournamentRoundHash/gameResult')
    .get(controller.getList);

AppRouter.route('/server/tournament/:tournamentHash/tournamentRound/:tournamentRoundHash/gameResult/:gameHash')
    .get(controller.getOne);

AppRouter.route('/server/tournament/:tournamentHash/tournamentRound/:tournamentRoundHash/gameResult/:gameHash')
    .post(controller.post);

AppRouter.route('/server/tournament/:tournamentHash/tournamentRound/:tournamentRoundHash/gameResult/:gameHash')
    .put(controller.put);

AppRouter.route('/server/tournament/:tournamentHash/tournamentRound/:tournamentRoundHash/gameResult/:gameHash')
    .delete(controller.delete);

module.exports = AppRouter;
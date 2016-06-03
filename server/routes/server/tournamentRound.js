var express = require('express');
var controller = require('../../controllers/tournamentRound');

var AppRouter = express.Router();

AppRouter.route('/server/tournament/:tournamentHash/tournamentRound')
    .get(controller.getList);

AppRouter.route('/server/tournament/:tournamentHash/tournamentRound/last')
    .get(controller.getLastOne);

AppRouter.route('/server/tournament/:tournamentHash/tournamentRound/:tournamentRoundHash')
    .get(controller.getOne);

AppRouter.route('/server/tournament/:tournamentHash/tournamentRound')
    .post(controller.post);

AppRouter.route('/server/tournament/:tournamentHash/tournamentRound/shuffle')
    .post(controller.shuffle);

AppRouter.route('/server/tournament/:tournamentHash/tournamentRound/importTeams')
    .post(controller.importTeams);

// AppRouter.route('/server/tournament/:tournamentHash/tournamentRound/:tournamentRoundHash')
//     .put(controller.put);

AppRouter.route('/server/tournament/:tournamentHash/tournamentRound/:tournamentRoundHash')
    .delete(controller.delete);

module.exports = AppRouter;
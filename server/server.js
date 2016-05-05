var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var multer = require('multer');
var ejs = require('ejs');

/* global variables */

var app = express();

/* pre configure */

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.use('/static', express.static('public')); // set up public foder
app.use('/assets', express.static('assets')); // set up public foder

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(bodyParser.json());       // to support JSON-encoded bodies

/* add routes */

var routes = [
    require('./routes/client/index'),
    require('./routes/server/tournament'),
    require('./routes/server/tournamentRound'),
    require('./routes/server/gameResult'),
    require('./routes/server/team')
];

_.forEach(routes, function(routes) {
    app.use(routes);
});

// var upload = multer({ dest: 'public/' })

// app.use(cookieParser());

/* routes */

// app.get('/', function (req, res) {
//     if (req.cookies.tournamentHash) {
//         res.redirect('/' +req.cookies.tournamentHash + '/listPlayers');
//     } else {
//         //todo: redirect to current tournament
//         res.redirect('/listTournaments');
//     }
// });

// app.post('/tournament2', function (req, res) {
    // res.cookie('user', { type: 'admin' });
    // res.redirect('/');
// });

// app.get('/:tournamentHash/listTournamentTable', function (req, res) {
//     teamModel.getAll(req.params.tournamentHash).then(function (people) {

//         var calculateGameResults = function(people1, people2, gameNumber) {

//             var gameResults = [];
//             _.forEach(people1, function(player) {
//                 if (player.gamesResults[gameNumber].points > player.gamesResults[gameNumber].opponentPoints) {
//                     var playerIndex = _.findIndex(people1, {id: player.id});
//                     gameResults.push({
//                         gameBefore: [playerIndex, _.findIndex(people1, {id: player.gamesResults[gameNumber].opponent})],
//                         gameAfter: [_.findIndex(people2, {id: player.id}), _.findIndex(people2, {id: player.gamesResults[gameNumber].opponent})],
//                         winner: playerIndex
//                     });
//                 }
//             });

//             gameResults = gameResults.sort(function (a,b) {
//                 var aMin = _.min(a.gameAfter);
//                 var bMin = _.min(b.gameAfter);
//                 return aMin - bMin;
//             });

//             return gameResults;

//         };

//         /* round 1 */

//         var listTours = [tournamentCollection.swidishCalculationResults(people, 0, 1)];
//         var listGames = [];

//         var maxGamePlayed = _.max(_.map(people, function(player) { return player.gamesResults.length; }));
//         for(var i=0; i<4; i++) {
//             var peopleListTmp = tournamentCollection.swidishCalculationResults(people, 0, i+1);
//             peopleListTmp = _.orderBy(peopleListTmp, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);
//             listTours.push(peopleListTmp);
//             listGames.push(calculateGameResults(listTours[listTours.length-2], listTours[listTours.length-1], i));
//         }

//         var additionalWins = [];
//         for(var i=5; i>=0; i--) {
//             additionalWins.push(_.fill(Array(4), i*8));
//         }
//         additionalWins = _.flatten(additionalWins);

//         peopleListTmp = _.orderBy(peopleListTmp, ['wins'], ['desc']);

//         var peopleListTmp = tournamentCollection.swidishCalculationResults(people, 0, 4);
//         peopleListTmp = _.orderBy(peopleListTmp, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);
//         peopleListTmp = tournamentCollection.swidishCalculationResults(peopleListTmp, 4, 5);
//         _.forEach(peopleListTmp, function(person, num) {
//             person.wins += additionalWins[num];
//         });
//         peopleListTmp = _.orderBy(peopleListTmp, ['wins'], ['desc']);
//         listTours.push(peopleListTmp);
//         listGames.push(calculateGameResults(listTours[listTours.length-2], listTours[listTours.length-1], 4));

//         additionalWins = [];
//         for(var i=10; i>=0; i--) {
//             additionalWins.push(_.fill(Array(2), i*8));
//         }
//         additionalWins = _.flatten(additionalWins);

//         peopleListTmp = tournamentCollection.swidishCalculationResults(peopleListTmp, 5, 6);
//         _.forEach(peopleListTmp, function(person, num) {
//             person.wins += additionalWins[num];
//         });
//         peopleListTmp = _.orderBy(peopleListTmp, ['wins'], ['desc']);
//         listTours.push(peopleListTmp);
//         listGames.push(calculateGameResults(listTours[listTours.length-2], listTours[listTours.length-1], 5));


//         // var people1 = tournamentCollection.swidishCalculationResults(people, 1);
//         // var people2 = _.orderBy(people1, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);
//         // people1 = people2;

//         // var games1 = calculateGameResults(people1, people2, 0);

//         // /* round 2 */

//         // var people3 = tournamentCollection.swidishCalculationResults(people, 2);
//         // people3 = _.orderBy(people3, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

//         // var games2 = calculateGameResults(people2, people3, 1);

//         // var people4 = tournamentCollection.swidishCalculationResults(people, 3);
//         // people4 = _.orderBy(people4, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

//         // var games3 = calculateGameResults(people3, people4, 2);


//         // var people5 = tournamentCollection.swidishCalculationResults(people, 4);
//         // people5 = _.orderBy(people5, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

//         // var games4 = calculateGameResults(people4, people5, 3);



//         /* round 2 */


//         // listPlayers = _.map(people, function(player) {
//         //     player.points = _.sum(_.map(player.gamesResults.slice(0,2), function(gameResult) {
//         //         return +gameResult.points - gameResult.opponentPoints;
//         //     }));

//         //     player.wins = _.sum(_.map(player.gamesResults, function(gameResult) {
//         //         return Number(gameResult.points > gameResult.opponentPoints);
//         //     }));

//         //     return player;
//         // });

//         // // we have to do this after all players have wins count from previous loop
//         // listPlayers = _.map(listPlayers, function(player) {
//         //     player.buhgolts = _.sum(_.map(player.gamesResults, function(gameResult) {
//         //         return _.find(listPlayers, {id: gameResult.opponent}).wins;
//         //     }));
//         //     return player;
//         // });

//         // var games2 = [];

//         // var people3 = _.orderBy(listPlayers, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

//         // _.forEach(listPlayers, function(player) {
//         //     if (player.gamesResults[1].points > player.gamesResults[1].opponentPoints) {
//         //         var playerIndex = _.findIndex(people2, {id: player.id});
//         //         games2.push({
//         //             gameBefore: [playerIndex, _.findIndex(people2, {id: player.gamesResults[1].opponent})],
//         //             gameAfter: [_.findIndex(people3, {id: player.id}), _.findIndex(people3, {id: player.gamesResults[1].opponent})],
//         //             winner: playerIndex
//         //         });
//         //     }
//         // });

//         // games2 = games2.sort(function (a,b) {
//         //     var aMin = _.min(a.gameBefore);
//         //     var bMin = _.min(b.gameBefore);
//         //     return aMin - bMin;
//         // });

//         // /* round 3 */

//         // listPlayers = _.map(people, function(player) {
//         //     player.points = _.sum(_.map(player.gamesResults.slice(0,3), function(gameResult) {
//         //         return +gameResult.points - gameResult.opponentPoints;
//         //     }));

//         //     player.wins = _.sum(_.map(player.gamesResults, function(gameResult) {
//         //         return Number(gameResult.points > gameResult.opponentPoints);
//         //     }));

//         //     return player;
//         // });

//         // // we have to do this after all players have wins count from previous loop
//         // listPlayers = _.map(listPlayers, function(player) {
//         //     player.buhgolts = _.sum(_.map(player.gamesResults, function(gameResult) {
//         //         return _.find(listPlayers, {id: gameResult.opponent}).wins;
//         //     }));
//         //     return player;
//         // });

//         // var games3 = [];

//         // var people4 = _.orderBy(listPlayers, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

//         // _.forEach(listPlayers, function(player) {
//         //     if (player.gamesResults[2].points > player.gamesResults[2].opponentPoints) {
//         //         var playerIndex = _.findIndex(people3, {id: player.id});
//         //         games3.push({
//         //             gameBefore: [playerIndex, _.findIndex(people3, {id: player.gamesResults[2].opponent})],
//         //             gameAfter: [_.findIndex(people4, {id: player.id}), _.findIndex(people4, {id: player.gamesResults[2].opponent})],
//         //             winner: playerIndex
//         //         });
//         //     }
//         // });

//         // games3 = games3.sort(function (a,b) {
//         //     var aMin = _.min(a.gameBefore);
//         //     var bMin = _.min(b.gameBefore);
//         //     return aMin - bMin;
//         // });

//         // /* round 4 */

//         // listPlayers = _.map(people, function(player) {
//         //     player.points = _.sum(_.map(player.gamesResults.slice(0,4), function(gameResult) {
//         //         return +gameResult.points - gameResult.opponentPoints;
//         //     }));

//         //     player.wins = _.sum(_.map(player.gamesResults, function(gameResult) {
//         //         return Number(gameResult.points > gameResult.opponentPoints);
//         //     }));

//         //     return player;
//         // });

//         // // we have to do this after all players have wins count from previous loop
//         // listPlayers = _.map(listPlayers, function(player) {
//         //     player.buhgolts = _.sum(_.map(player.gamesResults, function(gameResult) {
//         //         return _.find(listPlayers, {id: gameResult.opponent}).wins;
//         //     }));
//         //     return player;
//         // });

//         // var games4 = [];

//         // var people5 = _.orderBy(listPlayers, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

//         // _.forEach(listPlayers, function(player) {
//         //     if (player.gamesResults[3].points > player.gamesResults[3].opponentPoints) {
//         //         var playerIndex = _.findIndex(people4, {id: player.id});
//         //         games4.push({
//         //             gameBefore: [playerIndex, _.findIndex(people4, {id: player.gamesResults[3].opponent})],
//         //             gameAfter: [_.findIndex(people5, {id: player.id}), _.findIndex(people5, {id: player.gamesResults[3].opponent})],
//         //             winner: playerIndex
//         //         });
//         //     }
//         // });

//         // games4 = games4.sort(function (a,b) {
//         //     var aMin = _.min(a.gameBefore);
//         //     var bMin = _.min(b.gameBefore);
//         //     return aMin - bMin;
//         // });


//         // var groups = _.map(people1, function(person, number) {
//         //     return [number, _.findIndex(people2, {_id: person._id})];
//         // });

//         // groups = _.chunk(groups, 2);


//         // res.render('listTournamentTable', prepareRender.getRender({people1: people1, people2: people2, people3: people3, people4: people4, people5: people5, groups: games1, games2: games2, games3: games3, games4: games4}, req));
//         res.render('listTournamentTable', prepareRender.getRender({listTours: listTours, listGames: listGames}, req));
//         // res.render('listTournamentTable', prepareRender.getRender({people1: people1, people2: people2, people3: [], people4: [], people5: [], groups: games1, games2: [], games3: [], games4: []}, req));
//     }).catch(function(err) {
//         console.log(err);
//     });
// });

// app.get('/logout', function (req, res) {
//     res.cookie('user', { type: 'none' });
//     res.redirect('/');
// });

// app.get('/:tournamentHash/flushDB', function (req, res) {
//     errorMessage = '';
//     teamModel.getAll(req.params.tournamentHash).then(function (people) {
//         _.forEach(people, function(player) {
//             teamModel.update(player.id, {
//                 gamesResults: [],
//                 points: 0,
//                 wins: 0,
//                 buhgolts: 0,
//                 playWith: []
//             });
//         });
//     })
//     .then(groupModel.removeAll.bind(null, req.params.tournamentHash)) // todo. add tournamentHash
//     .then(function () {
//         res.redirect('/');;
//     })
//     .catch(function(err) {
//         console.log(err);
//         res.redirect('/');
//     });
// });

// // app.get('/addTournamentHash', function (req, res) {
// //     errorMessage = '';
// //     teamModel.getAll().then(function (people) {
// //         _.forEach(people, function(player) {
// //             teamModel.update(player.id, {
// //                 tournamentHash: 'l4x'
// //             });
// //         });
// //     })
// //     .then(function () {
// //         res.redirect('/');;
// //     })
// //     .catch(function(err) {
// //         console.log(err);
// //         res.redirect('/');
// //     });
// // });


// app.get('/:tournamentHash/listPlayers', function (req, res) {

//     res.cookie('tournamentHash', req.params.tournamentHash);

//     tournamentModel.get(req.params.tournamentHash).then(function (tournament){
//         teamModel.getAll(req.params.tournamentHash).then(function (people) {

//             listPlayers = _.map(people, function(player, num) {
//                 player.points = _.sum(_.map(player.gamesResults, function(gameResult) {
//                     return +gameResult.points - gameResult.opponentPoints;
//                 }));

//                 player.wins = _.sum(_.map(player.gamesResults, function(gameResult) {
//                     return Number(gameResult.points > gameResult.opponentPoints);
//                 }));

//                 player.icon = fs.readFileSync(__dirname + '/public/icons/animals-' + (num+1) + '.svg').toString();

//                 return player;
//             });

//             // we have to do this after all players have wins count from previous loop
//             listPlayers = _.map(listPlayers, function(player) {
//                 player.buhgolts = _.sum(_.map(player.gamesResults, function(gameResult) {
//                     return _.find(listPlayers, {id: gameResult.opponent}).wins;
//                 }));
//                 return player;
//             });

//             var players = _.orderBy(listPlayers, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

//             var gamePlayed = _.max(_.map(players, function(player) {
//                 return player.gamesResults.length;
//             }));

//             var allGamesScored = _.min(_.map(listPlayers, function(player) {
//                 return player.gamesResults.length == gamePlayed;
//             }));

//             res.render('listPlayers', prepareRender.getRender({people: players, gamePlayed: gamePlayed, allGamesScored: allGamesScored, tournament: tournament}, req));

//         }).catch(function (err) {
//             console.log(err);
//         });
//     }).catch(function (err) {
//         console.log(err);
//     });

// });
// app.get('/:tournamentHash/listPlayers/edit', function (req, res) {
//     res.redirect('/' + req.params.tournamentHash + '/listPlayersEdit');
// });

// app.get('/:tournamentHash/listPlayersEdit', function (req, res) {

//     res.cookie('tournamentHash', req.params.tournamentHash);

//     tournamentModel.get(req.params.tournamentHash).then(function (tournament){
//         teamModel.getAll(req.params.tournamentHash).then(function (people) {

//             listPlayers = _.map(people, function(player) {
//                 player.points = _.sum(_.map(player.gamesResults, function(gameResult) {
//                     return +gameResult.points - gameResult.opponentPoints;
//                 }));

//                 player.wins = _.sum(_.map(player.gamesResults, function(gameResult) {
//                     return Number(gameResult.points > gameResult.opponentPoints);
//                 }));

//                 return player;
//             });

//             // we have to do this after all players have wins count from previous loop
//             listPlayers = _.map(listPlayers, function(player) {
//                 player.buhgolts = _.sum(_.map(player.gamesResults, function(gameResult) {
//                     return _.find(listPlayers, {id: gameResult.opponent}).wins;
//                 }));
//                 return player;
//             });

//             var players = _.orderBy(listPlayers, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

//             var gamePlayed = _.max(_.map(players, function(player) {
//                 return player.gamesResults.length;
//             }));

//             var allGamesScored = _.min(_.map(listPlayers, function(player) {
//                 return player.gamesResults.length == gamePlayed;
//             }));

//             res.render('listPlayers', prepareRender.getRender({people: players, gamePlayed: gamePlayed, isEditMode: true, isSuperEdit: true, allGamesScored: allGamesScored, tournament: tournament}, req));

//         }).catch(function (err) {
//             console.log(err);
//         });
//     }).catch(function (err) {
//         console.log(err);
//     });

// });

// app.get('/listTournaments', function (req, res) {
//     tournamentModel.getAll().then(function (tournaments) {
//         res.render('listTournaments', prepareRender.getRender({tournaments: tournaments}, req));
//     }).catch(function (err) {
//         console.log(err);
//     });
// });

// app.get('/addTournament', function (req, res) {
//     res.render('addTournament', prepareRender.getRender({}, req));
// });

// app.post('/addTournament', function (req, res) {

//     tournamentModel.add({
//         title: req.body.title,
//         description: req.body.description,
//         startDate: timer.getTime(),
//         endDate: timer.getTime(),
//         location: req.body.location
//     }).then(function() {
//         res.redirect('/listTournaments'); // should redirect to edit mode
//     }).catch(function(err) {
//         errorMessage = 'Error: ' + err;
//         console.log(err);
//         res.redirect('/listTournaments'); // should redirect to edit mode
//     });

// });

// app.get('/:tournamentHash/listPlayersGroups', function (req, res) {

//     errorMessage = '';
//     tournamentModel.get(req.params.tournamentHash).then(function (tournament){

//         teamModel.getAll(req.params.tournamentHash).then(function (listPlayers) {

//             groupModel.getAll(req.params.tournamentHash).then(function (groups) {

//                 var groupedTeams = _.map(groups, function (groupTmp) {

//                     var teamsIds = groupTmp.group;

//                     var group = {
//                         persons: _.map(teamsIds, function(personId) {

//                             var person = _.find(listPlayers, {id: personId});

//                             var opponetId = _.head(_.difference(teamsIds, [person.id]));
//                             if (opponetId) {

//                                 var gameResult = _.find(person.gamesResults, {opponent: opponetId});
//                                 if (gameResult) {
//                                     person.pointsString = '(' + gameResult.points + ')';
//                                     person.isWinner = gameResult.points > gameResult.opponentPoints;
//                                     person.isLooser = gameResult.points < gameResult.opponentPoints;
//                                 } else {
//                                     person.pointsString = '';
//                                     person.isWinner = false;
//                                     person.isLooser = false;
//                                 }
//                             }

//                             person.icon = fs.readFileSync(__dirname + '/public/icons/animals-' + Math.round(Math.random() * 80) + '.svg').toString();

//                             return person;

//                         }),
//                         teamsIds: teamsIds
//                     };

//                     return group;
//                 });

//                 res.render('listPlayersGroups', prepareRender.getRender({groups: groupedTeams, errorMessage: errorMessage, tournament: tournament}, req));

//             }).catch(function (err) {
//                 console.log(err);
//             });

//         }).catch(function (err) {
//             console.log(err);
//         });

//     }).catch(function (err) {
//         console.log(err);
//     });

// });

// app.get('/:tournamentHash/listPlayersGroups/edit', function (req, res) {
//     res.redirect('/' + req.params.tournamentHash +'/listPlayersGroupsEdit');
// });

// app.get('/:tournamentHash/listPlayersGroupsEdit', function (req, res) {

//     tournamentModel.get(req.params.tournamentHash).then(function (tournament){

//         teamModel.getAll(req.params.tournamentHash).then(function (listPlayers) {

//             groupModel.getAll(req.params.tournamentHash).then(function (groups) {

//                 var groupedTeams = _.map(groups, function (groupTmp) {

//                     var teamsIds = groupTmp.group;

//                     var group = {
//                         persons: _.map(teamsIds, function(personId) {

//                             var person = _.find(listPlayers, {id: personId});

//                             var opponetId = _.head(_.difference(teamsIds, [person.id]));
//                             if (opponetId) {

//                                 var gameResult = _.find(person.gamesResults, {opponent: opponetId});
//                                 if (gameResult) {
//                                     person.pointsString = '(' + gameResult.points + ')';
//                                     person.isWinner = gameResult.points > gameResult.opponentPoints;
//                                     person.isLooser = gameResult.points < gameResult.opponentPoints;
//                                 } else {
//                                     person.pointsString = '';
//                                     person.isWinner = false;
//                                     person.isLooser = false;
//                                 }
//                             }

//                             return person;

//                         }),
//                         teamsIds: teamsIds
//                     };

//                     return group;
//                 });

//                 res.render('listPlayersGroups', prepareRender.getRender({groups: groupedTeams, errorMessage: errorMessage, isEditMode: true, tournament: tournament}, req));

//             }).catch(function (err) {
//                 console.log(err);
//             });

//         }).catch(function (err) {
//             console.log(err);
//         });

//     }).catch(function (err) {
//         console.log(err);
//     });

// });

// app.get('/:tournamentHash/addPlayer', function (req, res) {
//     tournamentModel.get(req.params.tournamentHash).then(function (tournament){
//         var colours = colorModel.getRandom(5);
//         res.render('addPlayer', prepareRender.getRender({tournament: tournament, colours: colours}, req));
//     }).catch(function(err) {
//         errorMessage = 'Error: ' + err;
//         console.log(err);
//         res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//     });
// });

// app.post('/:tournamentHash/addPlayer', upload.single('newImage'), function (req, res) {

//     teamModel.add({
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         color: req.body.color,
//         playWith: [],
//         gamesResults: [],
//         tournamentHash: req.params.tournamentHash
//     }).then(function(player) {

//         if (req.file && req.file.originalname) {
//             var parsed = path.parse(req.file.originalname);
//             if (parsed && parsed.ext && req.file.path) {
//                 var newImage = player.id + parsed.ext;
//                 fs.rename(__dirname + '/' +req.file.path, __dirname + '/public/' + newImage);
//                 teamModel.update(player.id, {image: newImage}).then(function() {
//                     res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//                 });
//             } else {
//                 res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//             }
//         } else {
//             res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//         }
//     }).catch(function(err) {
//         errorMessage = 'Error: ' + err;
//         console.log(err);
//         res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//     });
// });

// app.get('/:tournamentHash/deletePlayer/:playerId', function (req, res) {
//     teamModel.remove(req.params.playerId).then(function() {
//         res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//     }).catch(function(err) {
//         errorMessage = 'Error: ' + err;
//         console.log(err);
//         res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//     });
// });

// app.get('/:tournamentHash/editPlayer/:playerId', function (req, res) {
//     tournamentModel.get(req.params.tournamentHash).then(function (tournament){
//         teamModel.get(req.params.playerId).then(function(player) {
//             var colours = colorModel.getRandom(4);
//             res.render('editPlayer', prepareRender.getRender({player: player, tournament: tournament, colours: colours}, req));
//         }).catch(function(err) {
//             errorMessage = 'Error: ' + err;
//             res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//         });
//     }).catch(function(err) {
//         errorMessage = 'Error: ' + err;
//         res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//     });
// });

// app.post('/:tournamentHash/editPlayer/:playerId', upload.single('newImage'), function (req, res) {

//     var updateParams = req.body;

//     if (req.file && req.file.originalname) {
//         var parsed = path.parse(req.file.originalname);
//         if (parsed && parsed.ext && req.file.path) {
//             fs.rename(__dirname + '/' +req.file.path, __dirname + '/public/' + req.params.playerId + parsed.ext);
//             updateParams.image = req.params.playerId + parsed.ext;
//         }
//     }

//     teamModel.update(req.params.playerId, updateParams).then(function() {
//         res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//     }).catch(function(err) {
//         errorMessage = 'Error: ' + err;
//         console.log(err);
//         res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//     });
// });

// app.get('/:tournamentHash/random', function (req, res) {

//     prepareRender.timer[req.params.tournamentHash] = new Date();

//     new Promise(function (resolve, reject) {

//         teamModel.getAll(req.params.tournamentHash).then(function (teams) {
//             if (teams.length % 2) {
//                 teamModel.add({
//                     firstName: "Random",
//                     lastName: "player",
//                     playWith: [],
//                     gamesResults: [],
//                     tournamentHash: req.params.tournamentHash
//                 }).then(function (team) {
//                     teams.push(team);
//                     resolve(teams);
//                 })
//             } else {
//                 resolve(teams);
//             }
//         });

//     }).then(function (listPlayers) {

//         listPlayers = _.map(listPlayers, function(player) {
//             player.points = _.sum(_.map(player.gamesResults, function(gameResult) {
//                 return +gameResult.points - gameResult.opponentPoints;
//             }));

//             player.wins = _.sum(_.map(player.gamesResults, function(gameResult) {
//                 return Number(gameResult.points > gameResult.opponentPoints);
//             }));

//             return player;
//         });

//         // we have to do this after all players have wins count from previous loop
//         listPlayers = _.map(listPlayers, function(player) {
//             player.buhgolts = _.sum(_.map(player.gamesResults, function(gameResult) {
//                 return _.find(listPlayers, {id: gameResult.opponent}).wins;
//             }));
//             return player;
//         });

//         listPlayers = _.shuffle(listPlayers);

//         listPlayers = _.orderBy(listPlayers, ['wins'], ['desc']);

//         groupModel.removeAll(req.params.tournamentHash).then(function () {

//             var groupList = treeChoises(listPlayers, 1);
//             Promise.all(_.map(groupList, function(group) {
//                 _.find(listPlayers, {id: group[0]}).playWith.push(group[1]);
//                 _.find(listPlayers, {id: group[1]}).playWith.push(group[0]);
//                 return Promise.resolve(groupModel.add({group: group, tournamentHash: req.params.tournamentHash}));
//             })).then(function () {
//                 return Promise.all(_.map(listPlayers, function (player) {
//                     return teamModel.update(player._id, player);
//                 }));
//             }).then(function () {
//                 if (_.size(groupList) === 0)
//                     errorMessage = 'We don\'t have any options for make teams.';
//                 res.redirect('/' + req.params.tournamentHash + '/listPlayersGroups');
//             });

//         });

//     }).catch(function (err) {
//         errorMessage = 'Something went wrong';
//         console.log(err);
//         res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//     });

// });

// app.get('/:tournamentHash/enterResult', function (req, res) {
//     tournamentModel.get(req.params.tournamentHash).then(function (tournament) {
//         teamModel.getAll(req.params.tournamentHash).then(function (people) {
//             res.render('enterResult', prepareRender.getRender({tournament: tournament, teamA: _.find(people, {id: req.query.teamAId}), teamB: _.find(people, {id: req.query.teamBId})}, req));
//         }).catch(function (err) {
//             errorMessage = 'Something went wrong';
//             console.log(err);
//             res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//         });
//     }).catch(function (err) {
//         errorMessage = 'Something went wrong';
//         console.log(err);
//         res.redirect('/' + req.params.tournamentHash + '/listPlayers');
//     });
// });

// app.post('/:tournamentHash/enterResult', function (req, res) {

//     teamModel.getAll(req.params.tournamentHash).then(function (listPlayers) {

//         var teamA = _.find(listPlayers, {id: req.body.teamAId});
//         var teamB = _.find(listPlayers, {id: req.body.teamBId});

//         if (teamA.gamesResults.length === teamA.playWith.length) {
//             teamA.gamesResults.pop();
//         }

//         if (teamB.gamesResults.length === teamB.playWith.length) {
//             teamB.gamesResults.pop();
//         }

//         teamA.gamesResults.push({
//             points: _.toNumber(req.body.teamA),
//             opponentPoints: _.toNumber(req.body.teamB),
//             opponent: teamB.id,
//             opponentFirstName: teamB.firstName,
//             opponentLastName: teamB.lastName,
//         });

//         teamB.gamesResults.push({
//             points: _.toNumber(req.body.teamB),
//             opponentPoints: _.toNumber(req.body.teamA),
//             opponent: teamA.id,
//             opponentFirstName: teamA.firstName,
//             opponentLastName: teamA.lastName,
//         });

//         return Promise.all([
//             teamModel.update(teamA._id, teamA),
//             teamModel.update(teamB._id, teamB),
//         ]).then(function() {
//             res.redirect('/' + req.params.tournamentHash + '/listPlayersGroups');
//         }).catch(function (err) {
//             console.log(err);
//             res.redirect('/' + req.params.tournamentHash + '/listPlayersGroups');
//         });

//     }).catch(function (err) {
//         console.log(err);
//         res.redirect('/' + req.params.tournamentHash + '/listPlayersGroups');
//     });
// });

/* server run */

module.exports = app;

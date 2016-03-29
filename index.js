/* libraries */

var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser')
var _ = require('lodash');
var cookieParser = require('cookie-parser')
var treeChoises = require('./helpers/functions').treeChoises;
var prepareRender = new require('./helpers/functions').prepareRenderConstructor();
var teamModel = require('./models/team');
var tournamentModel = require('./models/tournament');
var groupModel = require('./models/group');
var mongoose = require('mongoose');
var hashids = new require('hashids')('anton', 1, 'qwertyuiopasdfghjklzxcvbnm1234567890');

var DB_USERNAME = process.env.DB_USERNAME || require('./constants').DB_USERNAME;
var DB_PASSWORD = process.env.DB_PASSWORD || require('./constants').DB_PASSWORD;
var DB_URI = 'mongodb://'+ DB_USERNAME +':'+ DB_PASSWORD +'@ds013559.mlab.com:13559/tornament';

/* global variables */

var app = express();
var timer = new Date();
var errorMessage = '';
var listPlayers;
var groups;

/* db connect and schema */

var db = mongoose.connect(DB_URI);

/* pre configure */

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(cookieParser());

/* routes */

app.get('/', function (req, res) {
    if (req.cookies.tournamentHash) {
        res.redirect('/' +req.cookies.tournamentHash + '/listPlayers');
    } else {
        //todo: redirect to current tournament
        res.redirect('/listTournaments');
    }
});

app.get('/login', function (req, res) {
    res.cookie('user', { type: 'admin' });
    res.redirect('/');
});

app.get('/logout', function (req, res) {
    res.cookie('user', { type: 'none' });
    res.redirect('/');
});

app.get('/:tournamentHash/flushDB', function (req, res) {
    errorMessage = '';
    teamModel.getAll(req.params.tournamentHash).then(function (people) {
        _.forEach(people, function(player) {
            teamModel.update(player.id, {
                gamesResults: [],
                points: 0,
                wins: 0,
                buhgolts: 0,
                playWith: []
            });
        });
    })
    .then(groupModel.removeAll.bind(null, req.params.tournamentHash)) // todo. add tournamentHash
    .then(function () {
        res.redirect('/');;
    })
    .catch(function(err) {
        console.log(err);
        res.redirect('/');
    });
});

// app.get('/addTournamentHash', function (req, res) {
//     errorMessage = '';
//     teamModel.getAll().then(function (people) {
//         _.forEach(people, function(player) {
//             teamModel.update(player.id, {
//                 tournamentHash: 'l4x'
//             });
//         });
//     })
//     .then(function () {
//         res.redirect('/');;
//     })
//     .catch(function(err) {
//         console.log(err);
//         res.redirect('/');
//     });
// });


app.get('/:tournamentHash/listPlayers', function (req, res) {

    res.cookie('tournamentHash', req.params.tournamentHash);

    tournamentModel.get(req.params.tournamentHash).then(function (tournament){
        teamModel.getAll(req.params.tournamentHash).then(function (people) {

            listPlayers = _.map(people, function(player) {
                player.points = _.sum(_.map(player.gamesResults, function(gameResult) {
                    return +gameResult.points - gameResult.opponentPoints;
                }));

                player.wins = _.sum(_.map(player.gamesResults, function(gameResult) {
                    return Number(gameResult.points > gameResult.opponentPoints);
                }));

                return player;
            });

            // we have to do this after all players have wins count from previous loop
            listPlayers = _.map(listPlayers, function(player) {
                player.buhgolts = _.sum(_.map(player.gamesResults, function(gameResult) {
                    return _.find(listPlayers, {id: gameResult.opponent}).wins;
                }));
                return player;
            });

            var players = _.orderBy(listPlayers, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

            var gamePlayed = _.max(_.map(players, function(player) {
                return player.gamesResults.length;
            }));

            var allGamesScored = _.min(_.map(listPlayers, function(player) {
                return player.gamesResults.length == gamePlayed;
            }));

            res.render('listPlayers', prepareRender.getRender({people: players, gamePlayed: gamePlayed, allGamesScored: allGamesScored, tournament: tournament}, req));

        }).catch(function (err) {
            console.log(err);
        });
    }).catch(function (err) {
        console.log(err);
    });

});
app.get('/:tournamentHash/listPlayers/edit', function (req, res) {
    res.redirect('/' + req.params.tournamentHash + '/listPlayersEdit');
});

app.get('/:tournamentHash/listPlayersEdit', function (req, res) {

    res.cookie('tournamentHash', req.params.tournamentHash);

    tournamentModel.get(req.params.tournamentHash).then(function (tournament){
        teamModel.getAll(req.params.tournamentHash).then(function (people) {

            listPlayers = _.map(people, function(player) {
                player.points = _.sum(_.map(player.gamesResults, function(gameResult) {
                    return +gameResult.points - gameResult.opponentPoints;
                }));

                player.wins = _.sum(_.map(player.gamesResults, function(gameResult) {
                    return Number(gameResult.points > gameResult.opponentPoints);
                }));

                return player;
            });

            // we have to do this after all players have wins count from previous loop
            listPlayers = _.map(listPlayers, function(player) {
                player.buhgolts = _.sum(_.map(player.gamesResults, function(gameResult) {
                    return _.find(listPlayers, {id: gameResult.opponent}).wins;
                }));
                return player;
            });

            var players = _.orderBy(listPlayers, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

            var gamePlayed = _.max(_.map(players, function(player) {
                return player.gamesResults.length;
            }));

            var allGamesScored = _.min(_.map(listPlayers, function(player) {
                return player.gamesResults.length == gamePlayed;
            }));

            res.render('listPlayers', prepareRender.getRender({people: players, gamePlayed: gamePlayed, isEditMode: true, isSuperEdit: true, allGamesScored: allGamesScored, tournament: tournament}, req));

        }).catch(function (err) {
            console.log(err);
        });
    }).catch(function (err) {
        console.log(err);
    });

});

app.get('/listTournaments', function (req, res) {
    tournamentModel.getAll().then(function (tournaments) {
        res.render('listTournaments', prepareRender.getRender({tournaments: tournaments}, req));
    }).catch(function (err) {
        console.log(err);
    });
});

app.get('/addTournament', function (req, res) {
    res.render('addTournament', prepareRender.getRender({}, req));
});

app.post('/addTournament', function (req, res) {

    tournamentModel.add({
        title: req.body.title,
        description: req.body.description,
        startDate: timer.getTime(),
        endDate: timer.getTime(),
        location: req.body.location
    }).then(function() {
        res.redirect('/listTournaments'); // should redirect to edit mode
    }).catch(function(err) {
        errorMessage = 'Error: ' + err;
        console.log(err);
        res.redirect('/listTournaments'); // should redirect to edit mode
    });

});

app.get('/:tournamentHash/listPlayersGroups', function (req, res) {

    errorMessage = '';
    tournamentModel.get(req.params.tournamentHash).then(function (tournament){

        teamModel.getAll(req.params.tournamentHash).then(function (listPlayers) {

            groupModel.getAll(req.params.tournamentHash).then(function (groups) {

                var groupedTeams = _.map(groups, function (groupTmp) {

                    var teamsIds = groupTmp.group;

                    var group = {
                        persons: _.map(teamsIds, function(personId) {

                            var person = _.find(listPlayers, {id: personId});

                            var opponetId = _.head(_.difference(teamsIds, [person.id]));
                            if (opponetId) {

                                var gameResult = _.find(person.gamesResults, {opponent: opponetId});
                                if (gameResult) {
                                    person.pointsString = '(' + gameResult.points + ')';
                                    person.isWinner = gameResult.points > gameResult.opponentPoints;
                                    person.isLooser = gameResult.points < gameResult.opponentPoints;
                                } else {
                                    person.pointsString = '';
                                    person.isWinner = false;
                                    person.isLooser = false;
                                }
                            }

                            return person;

                        }),
                        teamsIds: teamsIds
                    };

                    return group;
                });

                res.render('listPlayersGroups', prepareRender.getRender({groups: groupedTeams, errorMessage: errorMessage, tournament: tournament}, req));

            }).catch(function (err) {
                console.log(err);
            });

        }).catch(function (err) {
            console.log(err);
        });

    }).catch(function (err) {
        console.log(err);
    });

});

app.get('/:tournamentHash/listPlayersGroups/edit', function (req, res) {
    res.redirect('/' + req.params.tournamentHash +'/listPlayersGroupsEdit');
});

app.get('/:tournamentHash/listPlayersGroupsEdit', function (req, res) {

    tournamentModel.get(req.params.tournamentHash).then(function (tournament){

        teamModel.getAll(req.params.tournamentHash).then(function (listPlayers) {

            groupModel.getAll(req.params.tournamentHash).then(function (groups) {

                var groupedTeams = _.map(groups, function (groupTmp) {

                    var teamsIds = groupTmp.group;

                    var group = {
                        persons: _.map(teamsIds, function(personId) {

                            var person = _.find(listPlayers, {id: personId});

                            var opponetId = _.head(_.difference(teamsIds, [person.id]));
                            if (opponetId) {

                                var gameResult = _.find(person.gamesResults, {opponent: opponetId});
                                if (gameResult) {
                                    person.pointsString = '(' + gameResult.points + ')';
                                    person.isWinner = gameResult.points > gameResult.opponentPoints;
                                    person.isLooser = gameResult.points < gameResult.opponentPoints;
                                } else {
                                    person.pointsString = '';
                                    person.isWinner = false;
                                    person.isLooser = false;
                                }
                            }

                            return person;

                        }),
                        teamsIds: teamsIds
                    };

                    return group;
                });

                res.render('listPlayersGroups', prepareRender.getRender({groups: groupedTeams, errorMessage: errorMessage, isEditMode: true, tournament: tournament}, req));

            }).catch(function (err) {
                console.log(err);
            });

        }).catch(function (err) {
            console.log(err);
        });

    }).catch(function (err) {
        console.log(err);
    });

});

app.get('/:tournamentHash/addPlayer', function (req, res) {
    tournamentModel.get(req.params.tournamentHash).then(function (tournament){
        res.render('addPlayer', prepareRender.getRender({tournament: tournament}, req));
    }).catch(function(err) {
        errorMessage = 'Error: ' + err;
        console.log(err);
        res.redirect('/' + req.params.tournamentHash + '/listPlayers');
    });
});

app.post('/:tournamentHash/addPlayer', function (req, res) {
    teamModel.add({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        playWith: [],
        gamesResults: [],
        tournamentHash: req.params.tournamentHash
    }).then(function() {
        res.redirect('/' + req.params.tournamentHash + '/listPlayers');
    }).catch(function(err) {
        errorMessage = 'Error: ' + err;
        console.log(err);
        res.redirect('/' + req.params.tournamentHash + '/listPlayers');
    });
});

app.get('/:tournamentHash/deletePlayer/:playerId', function (req, res) {
    teamModel.remove(req.params.playerId).then(function() {
        res.redirect('/' + req.params.tournamentHash + '/listPlayers');
    }).catch(function(err) {
        errorMessage = 'Error: ' + err;
        console.log(err);
        res.redirect('/' + req.params.tournamentHash + '/listPlayers');
    });
});

app.get('/:tournamentHash/random', function (req, res) {

    prepareRender.timer[req.params.tournamentHash] = new Date();

    new Promise(function (resolve, reject) {

        teamModel.getAll(req.params.tournamentHash).then(function (teams) {
            if (teams.length % 2) {
                teamModel.add({
                    firstName: "Random",
                    lastName: "player",
                    playWith: [],
                    gamesResults: [],
                    tournamentHash: req.params.tournamentHash
                }).then(function (team) {
                    teams.push(team);
                    resolve(teams);
                })
            } else {
                resolve(teams);
            }
        });

    }).then(function (listPlayers) {

        listPlayers = _.map(listPlayers, function(player) {
            player.points = _.sum(_.map(player.gamesResults, function(gameResult) {
                return +gameResult.points - gameResult.opponentPoints;
            }));

            player.wins = _.sum(_.map(player.gamesResults, function(gameResult) {
                return Number(gameResult.points > gameResult.opponentPoints);
            }));

            return player;
        });

        // we have to do this after all players have wins count from previous loop
        listPlayers = _.map(listPlayers, function(player) {
            player.buhgolts = _.sum(_.map(player.gamesResults, function(gameResult) {
                return _.find(listPlayers, {id: gameResult.opponent}).wins;
            }));
            return player;
        });

        listPlayers = _.shuffle(listPlayers);

        listPlayers = _.orderBy(listPlayers, ['wins'], ['desc']);

        groupModel.removeAll(req.params.tournamentHash).then(function () {

            var groupList = treeChoises(listPlayers, 1);
            Promise.all(_.map(groupList, function(group) {
                _.find(listPlayers, {id: group[0]}).playWith.push(group[1]);
                _.find(listPlayers, {id: group[1]}).playWith.push(group[0]);
                return Promise.resolve(groupModel.add({group: group, tournamentHash: req.params.tournamentHash}));
            })).then(function () {
                return Promise.all(_.map(listPlayers, function (player) {
                    return teamModel.update(player._id, player);
                }));
            }).then(function () {
                if (_.size(groupList) === 0)
                    errorMessage = 'We don\'t have any options for make teams.';
                res.redirect('/' + req.params.tournamentHash + '/listPlayersGroups');
            });

        });

    }).catch(function (err) {
        errorMessage = 'Something went wrong';
        console.log(err);
        res.redirect('/' + req.params.tournamentHash + '/listPlayers');
    });

});

app.get('/:tournamentHash/enterResult', function (req, res) {
    tournamentModel.get(req.params.tournamentHash).then(function (tournament) {
        teamModel.getAll(req.params.tournamentHash).then(function (people) {
            res.render('enterResult', prepareRender.getRender({tournament: tournament, teamA: _.find(people, {id: req.query.teamAId}), teamB: _.find(people, {id: req.query.teamBId})}, req));
        }).catch(function (err) {
            errorMessage = 'Something went wrong';
            console.log(err);
            res.redirect('/' + req.params.tournamentHash + '/listPlayers');
        });
    }).catch(function (err) {
        errorMessage = 'Something went wrong';
        console.log(err);
        res.redirect('/' + req.params.tournamentHash + '/listPlayers');
    });
});

app.post('/:tournamentHash/enterResult', function (req, res) {

    teamModel.getAll(req.params.tournamentHash).then(function (listPlayers) {

        var teamA = _.find(listPlayers, {id: req.body.teamAId});
        var teamB = _.find(listPlayers, {id: req.body.teamBId});

        if (teamA.gamesResults.length === teamA.playWith.length) {
            teamA.gamesResults.pop();
        }

        if (teamB.gamesResults.length === teamB.playWith.length) {
            teamB.gamesResults.pop();
        }

        teamA.gamesResults.push({
            points: _.toNumber(req.body.teamA),
            opponentPoints: _.toNumber(req.body.teamB),
            opponent: teamB.id,
            opponentFirstName: teamB.firstName,
            opponentLastName: teamB.lastName,
        });

        teamB.gamesResults.push({
            points: _.toNumber(req.body.teamB),
            opponentPoints: _.toNumber(req.body.teamA),
            opponent: teamA.id,
            opponentFirstName: teamA.firstName,
            opponentLastName: teamA.lastName,
        });

        return Promise.all([
            teamModel.update(teamA._id, teamA),
            teamModel.update(teamB._id, teamB),
        ]).then(function() {
            res.redirect('/' + req.params.tournamentHash + '/listPlayersGroups');
        }).catch(function (err) {
            console.log(err);
            res.redirect('/' + req.params.tournamentHash + '/listPlayersGroups');
        });

    }).catch(function (err) {
        console.log(err);
        res.redirect('/' + req.params.tournamentHash + '/listPlayersGroups');
    });
});

/* server run */

app.listen(app.get('port'), function () {
    console.log('Example app listening on port ' + app.get('port') + '!');
});
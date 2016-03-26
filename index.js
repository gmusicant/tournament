/* libraries */

var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser')
var _ = require('lodash');
var cookieParser = require('cookie-parser')
var treeChoises = require('./helpers/functions').treeChoises;
var teamModel = require('./models/team');
var groupModel = require('./models/group');
var mongoose = require('mongoose');

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
    res.redirect('/listPlayers');
});

app.get('/login', function (req, res) {
    res.cookie('user', { type: 'admin' });
    res.redirect('/listPlayers');
});

app.get('/logout', function (req, res) {
    res.cookie('user', { type: 'none' });
    res.redirect('/listPlayers');
});

app.get('/flushDB', function (req, res) {
    errorMessage = '';
    teamModel.getAll().then(function (people) {
        _.forEach(people, function(player) {
            teamModel.update(player.id, {
                gamesResults: [],
                points: 0,
                wins: 0,
                buhgolts: 0,
                playWith: []
            });
        });
    }).then(groupModel.removeAll)
    .then(function () {
        res.redirect('/listPlayers');;
    })
    .catch(function(err) {
        console.log(err);
        res.redirect('/listPlayers');
    });
});


app.get('/listPlayers', function (req, res) {

    teamModel.getAll().then(function (people) {

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

        var isEditMode = req.cookies.user && req.cookies.user.type === 'admin';

        var allGamesScored = _.min(_.map(listPlayers, function(player) {
            return player.gamesResults.length == gamePlayed;
        }));

        var timeDiff = (new Date()).getTime() - timer.getTime();
        res.render('listPlayers', {people: players, gamePlayed: gamePlayed, isEditMode: isEditMode, isSuperEdit: false, allGamesScored: allGamesScored, timer: timeDiff});

    }).catch(function (err) {
        console.log(err);
    });

});

app.get('/listPlayers/edit', function (req, res) {
    res.redirect('/listPlayersEdit');
});

app.get('/listPlayersEdit', function (req, res) {

    teamModel.getAll().then(function (people) {

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

        var timeDiff = (new Date()).getTime() - timer.getTime();
        res.render('listPlayers', {people: players, gamePlayed: gamePlayed, isEditMode: true, isSuperEdit: true, allGamesScored: allGamesScored, timer: timeDiff});

    }).catch(function (err) {
        console.log(err);
    });

});

app.get('/listPlayersGroups', function (req, res) {

    teamModel.getAll().then(function (listPlayers) {

        groupModel.getAll().then(function (groups) {

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

            var isEditMode = req.cookies.user && req.cookies.user.type === 'admin';

            var timeDiff = (new Date()).getTime() - timer.getTime();
            res.render('listPlayersGroups', {groups: groupedTeams, errorMessage: errorMessage, timer: timeDiff, isEditMode: isEditMode});

        }).catch(function (err) {
            console.log(err);
        });

    }).catch(function (err) {
        console.log(err);
    });

});

app.get('/listPlayersGroups/edit', function (req, res) {
    res.redirect('/listPlayersGroupsEdit');
});

app.get('/listPlayersGroupsEdit', function (req, res) {

    teamModel.getAll().then(function (listPlayers) {

        groupModel.getAll().then(function (groups) {

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

            var timeDiff = (new Date()).getTime() - timer.getTime();
            res.render('listPlayersGroups', {groups: groupedTeams, errorMessage: errorMessage, timer: timeDiff, isEditMode: true});

        }).catch(function (err) {
            console.log(err);
        });

    }).catch(function (err) {
        console.log(err);
    });

});

app.get('/addPlayer', function (req, res) {
    var timeDiff = (new Date()).getTime() - timer.getTime();
    res.render('addPlayer', {timer: timeDiff});
});

app.post('/addPlayer', function (req, res) {
    teamModel.add({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        playWith: [],
        gamesResults: []
    }).then(function() {
        res.redirect('listPlayers');
    }).catch(function(err) {
        errorMessage = 'Error: ' + err;
        console.log(err);
        res.redirect('listPlayers');
    });
});

app.get('/deletePlayer/:playerId', function (req, res) {
    teamModel.remove(req.params.playerId).then(function() {
        res.redirect('/listPlayers');
    }).catch(function(err) {
        errorMessage = 'Error: ' + err;
        console.log(err);
        res.redirect('listPlayers');
    });
});


app.get('/random', function (req, res) {

    timer = new Date();

    new Promise(function (resolve, reject) {

        teamModel.getAll().then(function (teams) {
            if (teams.length % 2) {
                teamModel.add({
                    firstName: "Random",
                    lastName: "player",
                    playWith: [],
                    gamesResults: []
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

        groupModel.removeAll().then(function () {

            var groupList = treeChoises(listPlayers, 1);
            Promise.all(_.map(groupList, function(group) {
                return Promise.resolve(groupModel.add({group: group}));
            })).then(function () {

                return Promise.all(_.map(listPlayers, function (player) {
                    return teamModel.update(player._id, player);
                }));

            }).then(function () {
                if (_.size(groupList) === 0)
                    errorMessage = 'We don\'t have any options for make teams.';
                res.redirect('listPlayersGroups');
            });

        });

    }).catch(function (err) {
        errorMessage = 'Something went wrong';
        console.log(err);
        res.redirect('listPlayers');
    });

});

app.get('/enterResult', function (req, res) {
    var timeDiff = (new Date()).getTime() - timer.getTime();
    res.render('enterResult', {teamA: _.find(listPlayers, {id: req.query.teamAId}), teamB: _.find(listPlayers, {id: req.query.teamBId}), timer: timeDiff});
});

app.post('/enterResult', function (req, res) {

    teamModel.getAll().then(function (listPlayers) {

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
            res.redirect('listPlayersGroups');
        }).catch(function (err) {
            console.log(err);
            res.redirect('listPlayersGroups');
        });

    }).catch(function (err) {
        console.log(err);
        res.redirect('listPlayersGroups');
    });
});

/* server run */

app.listen(app.get('port'), function () {
    console.log('Example app listening on port ' + app.get('port') + '!');
});
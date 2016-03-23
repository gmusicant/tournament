/* constants */

var DB_PATH = './db/';
var DB_COLLECTION_TEAMS = 'teams';
var DB_COLLECTION_GROUPS = 'groups';
var DB_USERNAME = process.env.DB_USERNAME || require('./constants').DB_USERNAME;
var DB_PASSWORD = process.env.DB_PASSWORD || require('./constants').DB_PASSWORD;
var DB_URI = 'mongodb://'+ DB_USERNAME +':'+ DB_PASSWORD +'@ds013559.mlab.com:13559/tornament';

/* libraries */

var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser')
var _ = require('lodash');
var cookieParser = require('cookie-parser')
var treeChoises = require('./helpers/functions').treeChoises;
var mongoose = require('mongoose');

/* global variables */

var app = express();
var timer = new Date();
var errorMessage = '';
var listPlayers;
var groups;

/* db connect and schema */

var db = mongoose.connect(DB_URI);

var Person = mongoose.model('Person', {
    firstName: String,
    lastName: String,
    playWith: Array,
    gamesResults: [{
        points: Number,
        opponentPoints: Number,
        opponent: String,
        opponentFirstName: String,
        opponentLastName: String,
    }],
    points: Number,
    wins: Number,
    buhgolts: Number,
    isWinner: Boolean,
    isLooser: Boolean
});

var Group = mongoose.model('Group', {
    group: Array
});

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
    listPlayers = _.forEach(listPlayers, function(player) {
        player.gamesResults = [];
        player.points = 0;
        player.wins = 0;
        player.buhgolts = 0;
        player.playWith = [];

        Person.where({_id: player._id}).update(player, function(err, data) { if (err) console.log(err); });
    });

    _.forEach(groups, function (group) {
        var group = new Group(group);
        group.remove(function (err, product) {
            if (err)
                console.log(err);
        });
    });

    errorMessage = '';

    res.redirect('/listPlayers');
});


app.get('/listPlayers', function (req, res) {

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

    var players = _.orderBy(listPlayers, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

    var gamePlayed = _.max(_.map(players, function(player) {
        return player.gamesResults.length;
    }));

    var isEditMode = req.cookies.user && req.cookies.user.type === 'admin';

    var allGamesScored = _.min(_.map(listPlayers, function(player) {
        return player.gamesResults.length == gamePlayed;
    }));

    res.render('listPlayers', {people: players, gamePlayed: gamePlayed, isEditMode: isEditMode, isSuperEdit: false, allGamesScored: allGamesScored, timer: timer});
});

app.get('/listPlayers/edit', function (req, res) {
    res.redirect('/listPlayersEdit');
});

app.get('/listPlayersEdit', function (req, res) {

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

    var players = _.orderBy(listPlayers, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

    var gamePlayed = _.max(_.map(players, function(player) {
        return player.gamesResults.length;
    }));

    var isEditMode = req.cookies.user && req.cookies.user.type === 'admin';

    var allGamesScored = _.min(_.map(listPlayers, function(player) {
        return player.gamesResults.length == gamePlayed;
    }));

    res.render('listPlayers', {people: players, gamePlayed: gamePlayed, isEditMode: true, isSuperEdit: true, allGamesScored: allGamesScored, timer: timer});
});

app.get('/listPlayersGroups', function (req, res) {

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

    res.render('listPlayersGroups', {groups: groupedTeams, errorMessage: errorMessage, timer: timer, isEditMode: isEditMode});
});

app.get('/listPlayersGroups/edit', function (req, res) {
    res.redirect('/listPlayersGroupsEdit');
});

app.get('/listPlayersGroupsEdit', function (req, res) {

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

    res.render('listPlayersGroups', {groups: groups, errorMessage: errorMessage, timer: timer, isEditMode: true});
});

app.get('/addPlayer', function (req, res) {
    res.render('addPlayer', {timer: timer});
});

app.post('/addPlayer', function (req, res) {

    var person = new Person();
    person.firstName = req.body.firstName;
    person.lastName = req.body.lastName;
    person.playWith = [];
    person.gamesResults = [];

    Person.create(person, function(err, data) {
        if (err)
            console.log(err);
        else
            listPlayers.push(data);
        res.redirect('listPlayers');
    });

});

app.get('/deletePlayer/:playerId', function (req, res) {

    _.remove(listPlayers, function (player) {

        if (req.params.playerId === player.id) {

            var person = new Person(player);
            person.remove(function (err, product) {
                if (err)
                    console.log(err);
            });

            return true;
        }
        return false;
    });

    res.redirect('/listPlayers');
});


app.get('/random', function (req, res) {

    if (listPlayers.length % 2) {
        listPlayers.push({
            id: listPlayers.length + 1,
            firstName: "Random",
            lastName: "player",
            playWith: [],
            gamesResults: []
        })
    }

    timer = new Date();

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

    listPlayers = _.orderBy(listPlayers, ['points', 'buhgolts', 'wins']);

    _.forEach(groups, function (group) {
        var group = new Group(group);
        group.remove(function (err, product) {
            if (err)
                console.log(err);
        });
    });

    groups = [];

    var groupList = treeChoises(listPlayers, 1);
    Promise.all(_.map(groupList, function(group) {

        return new Promise(function (res, reg) {

            var groupModel = new Group();
            groupModel.group = group;
            Group.create(groupModel, function (err, data) {
                groups.push(data);
                res(data);
            });

        });

    })).then(function() {

        if (_.size(groupList) === 0)
            errorMessage = 'We don\'t have any options for make teams.';

        _.forEach(listPlayers, function (player) {
            Person.where({_id: player._id}).update(player, function(err, data) { if (err) console.log(err); });
        });

        res.redirect('listPlayersGroups');

    });

});

app.get('/enterResult', function (req, res) {
    res.render('enterResult', {teamA: _.find(listPlayers, {id: req.query.teamAId}), teamB: _.find(listPlayers, {id: req.query.teamBId}), timer: timer});
});

app.post('/enterResult', function (req, res) {

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

    Person.where({_id: teamA._id}).update(teamA, function(err, data) { if (err) console.log(err); });
    Person.where({_id: teamB._id}).update(teamB, function(err, data) { if (err) console.log(err); });

    res.redirect('listPlayersGroups');
});

/* server run */

Person.find(function(err, people) {

    if (!err) {

        listPlayers = people;

        Group.find(function(err, groupsIncome) {

            if (!err) {

                groups = groupsIncome;

                app.listen(app.get('port'), function () {
                    console.log('Example app listening on port ' + app.get('port') + '!');
                });

            } else {
                console.log(err);
            }

        });

    } else {
        console.log(err);
    }

});

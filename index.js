/* constants */

var DB_PATH = './db/';
var DB_COLLECTION_TEAMS = 'teams';
var DB_COLLECTION_GROUPS = 'groups';

/* libraries */

var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser')
var _ = require('lodash');
var cookieParser = require('cookie-parser')
var treeChoises = require('./helpers/functions').treeChoises;
var saveDB = require('./helpers/functions').saveDB.bind(null, DB_PATH);
var loadDB = require('./helpers/functions').loadDB.bind(null, DB_PATH);

/* global variables */

var app = express();
var timer = new Date();
var errorMessage = '';
var listPlayers = loadDB(DB_COLLECTION_TEAMS);
var groups = loadDB(DB_COLLECTION_GROUPS);

/* pre configure */

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
    });
    saveDB(DB_COLLECTION_TEAMS, listPlayers);
    groups = [];
    saveDB(DB_COLLECTION_GROUPS, groups);
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

    groups = _.map(groups, function (group) {

        var teamsIds = _.map(group, 'id');
        group = _.map(group, function(person) {

            person = _.find(listPlayers, {id: person.id});

            var opponetId = _.head(_.difference(teamsIds, [+person.id]));
            if (opponetId) {

                var gameResult = _.find(person.gamesResults, {opponent: +opponetId});
                if (gameResult) {
                    person.points = '('+gameResult.points+')';
                    person.isWinner = gameResult.points > gameResult.opponentPoints;
                    person.isLooser = gameResult.points < gameResult.opponentPoints;
                } else {
                    person.points = '';
                    person.isWinner = false;
                    person.isLooser = false;
                }
            }

            return person;

        });

        group.teamsIds = teamsIds;

        return group;
    });

    var isEditMode = req.cookies.user && req.cookies.user.type === 'admin';

    res.render('listPlayersGroups', {groups: groups, errorMessage: errorMessage, timer: timer, isEditMode: isEditMode});
});

app.get('/listPlayersGroups/edit', function (req, res) {
    res.redirect('/listPlayersGroupsEdit');
});

app.get('/listPlayersGroupsEdit', function (req, res) {

    groups = _.map(groups, function (group) {

        var teamsIds = _.map(group, 'id');
        group = _.map(group, function(person) {

            person = _.find(listPlayers, {id: person.id});

            var opponetId = _.head(_.difference(teamsIds, [+person.id]));
            if (opponetId) {

                var gameResult = _.find(person.gamesResults, {opponent: +opponetId});
                if (gameResult) {
                    person.points = '('+gameResult.points+')';
                    person.isWinner = gameResult.points > gameResult.opponentPoints;
                    person.isLooser = gameResult.points < gameResult.opponentPoints;
                } else {
                    person.points = '';
                    person.isWinner = false;
                    person.isLooser = false;
                }
            }

            return person;

        });

        group.teamsIds = teamsIds;

        return group;
    });

    res.render('listPlayersGroups', {groups: groups, errorMessage: errorMessage, timer: timer, isEditMode: true});
});

app.get('/addPlayer', function (req, res) {
    res.render('addPlayer', {timer: timer});
});

app.post('/addPlayer', function (req, res) {

    listPlayers.push({
        id: listPlayers.length + 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        playWith: [],
        gamesResults: []
    });

    saveDB(DB_COLLECTION_TEAMS, listPlayers);

    res.redirect('listPlayers');
});

app.get('/deletePlayer/:playerId', function (req, res) {

    _.remove(listPlayers, function (player) {
        return +req.params.playerId === +player.id;
    });

    saveDB(DB_COLLECTION_TEAMS, listPlayers);

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

    groups = treeChoises(listPlayers, 1);
    if (_.size(groups) === 0)
        errorMessage = 'We don\'t have any options for make teams.';

    saveDB(DB_COLLECTION_TEAMS, listPlayers);
    saveDB(DB_COLLECTION_GROUPS, groups);

    res.redirect('listPlayersGroups');
});

app.get('/enterResult', function (req, res) {
    res.render('enterResult', {teamA: _.find(listPlayers, {id: +req.query.teamAId}), teamB: _.find(listPlayers, {id: +req.query.teamBId}), timer: timer});
});

app.post('/enterResult', function (req, res) {

    var teamA = _.find(listPlayers, {id: +req.body.teamAId});
    var teamB = _.find(listPlayers, {id: +req.body.teamBId});

    if (teamA.gamesResults.length === teamA.playWith.length)
        teamA.gamesResults.pop();

    if (teamB.gamesResults.length === teamB.playWith.length)
        teamB.gamesResults.pop();

    teamA.gamesResults.push({
        points: +req.body.teamA,
        opponentPoints: +req.body.teamB,
        opponent: teamB.id,
        opponentFirstName: teamB.firstName,
        opponentLastName: teamB.lastName,
    });

    teamB.gamesResults.push({
        points: +req.body.teamB,
        opponentPoints: +req.body.teamA,
        opponent: +req.body.teamAId,
        opponentFirstName: teamA.firstName,
        opponentLastName: teamA.lastName,
    });

    saveDB(DB_COLLECTION_TEAMS, listPlayers);
    saveDB(DB_COLLECTION_GROUPS, groups);

    res.redirect('listPlayersGroups');
});

/* server run */

app.listen(443, function () {
    console.log('Example app listening on port 3000!');
});
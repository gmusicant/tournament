var React = require('react');
var _ = require('lodash');

var TournamentResultOlympic = React.createClass({

    getInitialState: function() {

        var teams = _.map(this.props.teams, function(team) {
            return team.title;
        });

        var hashes = _.map(this.props.teams, function(team) {
            return team.hash;
        });

        var results = [];

        _.forEach(this.props.tournament.rounds, function(round) {

            var roundResults = [];

            var games = _.map(round.games, function(game) {
                game.index = hashes.indexOf(game.game[0]);
                return game;
            });

            games = _.orderBy(games, ['index'], ['asc']);

            _.forEach(games, function(game) {

                if (game.results && game.results[0] && game.results[1] && !_.isNull(game.results[0].score) && !_.isNull(game.results[1].score)) {

                    if (hashes.indexOf(game.results[1].teamHash) < hashes.indexOf(game.results[0].teamHash)) {
                        roundResults.push({
                            gameHash: game.hash,
                            roundHash: round.hash,
                            scores: [game.results[1].score, game.results[0].score],
                            teamHashes: game.game
                        });
                    } else {
                        roundResults.push({
                            gameHash: game.hash,
                            roundHash: round.hash,
                            scores: [game.results[0].score, game.results[1].score],
                            teamHashes: game.game
                        });
                    }

                } else {
                    roundResults.push({
                        gameHash: game.hash,
                        roundHash: round.hash,
                        scores: [],
                        teamHashes: game.game
                    });
                }

            });

            results.push(roundResults);

        });

        return {
            results: results,
            teams: _.chunk(teams, 2),
            hashes: hashes
        };
    },

    saveScores: function(el) {

        var teams = el.teams;
        var results = el.results;
        var tournametHash = this.props.tournament.hash;
        var hashes = this.state.hashes;

        var stateResults = this.state.results;

        _.forEach(_.first(results), function(round, key) {

            if (stateResults[key]) {

                var stateRound = stateResults[key];
                _.forEach(round, function(game, gameKey) {
                    if (game.length === 2) {
                        if (!_.isUndefined(game[1]) || !_.isUndefined(game[0])) {
                            if (_.isUndefined(game[1])) {
                                game[1] = 0;
                            }
                            if (_.isUndefined(game[0])) {
                                game[0] = 0;
                            }
                        } else {
                            game = [];
                        }
                    }
                    if (game.length) {
                        if (stateRound[gameKey].scores) {
                            var diff = _.difference(game, stateRound[gameKey].scores);
                            if (diff.length) {

                                var teamA, teamB;
                                if (hashes.indexOf(stateRound[gameKey].teamHashes[0]) < hashes.indexOf(stateRound[gameKey].teamHashes[1])) {
                                    teamA = stateRound[gameKey].teamHashes[0];
                                    teamB = stateRound[gameKey].teamHashes[1];
                                } else {
                                    teamA = stateRound[gameKey].teamHashes[1];
                                    teamB = stateRound[gameKey].teamHashes[0];
                                }

                                var url = '/server/tournament/' + tournametHash + '/tournamentRound/' + stateRound[gameKey].roundHash + '/gameResult/' + stateRound[gameKey].gameHash;
                                var data = {};
                                data[teamA] = game[0];
                                data[teamB] = game[1];

                                stateRound[gameKey].scores = game;

                                $.ajax({
                                    url: url,
                                    type: 'post',
                                    data: data,
                                    cache: false,
                                    success: function(data) {
                                        console.log('success');
                                    }.bind(this),
                                    error: function(xhr, status, err) {
                                        console.error(this.props, status, err.toString());
                                    }.bind(this)
                                });

                                // console.log(teamA, teamB, stateRound[gameKey].scores[0], stateRound[gameKey].scores[1]);

                            }
                        }
                    }
                });
            }
        });

        this.drowBracket();

    },

    drowBracket: function() {

        var results = _.map(this.state.results, function(round) {
            var roundScores = _.map(round, function(game) {
                return game.scores;
            })
            return roundScores;
        });

        var singleElimination = {
          "teams": this.state.teams,
          "results": results
        };

        $('#bracket').bracket({
          init: singleElimination,
          save: this.saveScores
        });

    },

    componentDidMount: function () {
        this.drowBracket();
    },

    render: function() {
        return (
            <div className="comment">
                <div id="bracket"></div>
            </div>
        );
    }
});

module.exports = TournamentResultOlympic;
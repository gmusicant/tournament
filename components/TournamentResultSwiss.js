var React = require('react');
var Table = require('react-bootstrap').Table;
var Label = require('react-bootstrap').Label;
var _ = require('lodash');

var TournamentResultSweed = React.createClass({

    getInitialState: function() {
        return {
            tournament: [],
            teams: []
        };
    },

    render: function() {

        var maxRounds = (this.props.tournament && this.props.tournament.rounds && this.props.tournament.rounds.length) ? this.props.tournament.rounds.length : 0;

        var teamRow = [];
        var additionalTd = [];
        _.forEach(this.props.teams, (function (rounds, teams, team, key) {

            team.wins = 0;
            team.points = 0;
            team.buhgolts = 0;
            additionalTd[team.hash] = [];

            var tds = [];
            for(var i = 0; i < maxRounds; i++) {

                var game = _.find(rounds[i].games, function(el) {
                    return el.game.indexOf(team.hash) >= 0;
                });

                var scoreString = '';

                if (game && game.results && game.results.length) {

                    var results = _.clone(game.results);
                    var resultIndex = _.findIndex(results, {teamHash: team.hash});
                    if (resultIndex !== -1) {

                        var scoreA = results[resultIndex].score;
                        results.splice(resultIndex, 1);
                        var scoreB = results[0].score;

                        team.wins += (scoreA > scoreB);
                        team.points += scoreA - scoreB;

                        var labelType;
                        if ((scoreA == scoreB))
                            labelType = 'warning';
                        else
                            labelType = (scoreA > scoreB) ? 'success' : 'danger';

                        scoreString = (
                            <Label bsStyle={labelType}>{scoreA}/{scoreB}({scoreA - scoreB})</Label>
                        );

                    }

                }

                additionalTd[team.hash].push(
                    <td key={'gameresult' + team.hash + i}>
                        {scoreString}
                    </td>
                );

            }

        }).bind(this, this.props.tournament.rounds, this.props.teams));

        _.forEach(this.props.teams, (function (rounds, teams, team, key) {

            for(var i = 0; i < maxRounds; i++) {

                var game = _.clone(_.find(rounds[i].games, function(el) {
                    return el.game.indexOf(team.hash) >= 0;
                }));

                var game = _.clone(game.game);

                var teamHashIndex = game.indexOf(team.hash);
                if (teamHashIndex !== -1) {

                    game.splice(teamHashIndex, 1);

                    var teamBHash = game[0];
                    var teamB = _.find(teams, {hash: teamBHash});

                    if (teamB) {
                        teamB.buhgolts += team.wins;
                    }

                }

            }

        }).bind(this, this.props.tournament.rounds, this.props.teams));

        var teams = _.orderBy(this.props.teams, ['wins', 'buhgolts', 'points'], ['desc', 'desc', 'desc']);

        _.forEach(teams, (function (rounds, teams, team, key) {

            teamRow.push(
                <tr key={'team-' + key}>
                    <td>{key + 1}</td>
                    <td>{team.title}</td>
                    <td>{team.wins}</td>
                    <td>{team.buhgolts}</td>
                    <td>{team.points}</td>
                    {additionalTd[team.hash]}
                </tr>
            );

        }).bind(this, this.props.tournament.rounds, this.props.teams));

        var additionalTdHead = [];
        for(var i = 0; i < maxRounds; i++) {

            additionalTdHead.push(
                <td key={'resulthead-' + i}>Round {i+1}</td>
            );
        }

        return (
          <div className="comment">
            <div>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>title</td>
                            <td>wins</td>
                            <td>buhgolts</td>
                            <td>points</td>
                            {additionalTdHead}
                        </tr>
                    </thead>
                    <tbody>
                        {teamRow}
                    </tbody>
                </Table>
            </div>
          </div>
        );
    }
});

module.exports = TournamentResultSweed;
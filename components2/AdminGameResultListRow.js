var React = require('react');
var Link = require('react-router').Link;
var _ = require('lodash');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var AdminGameResultListRow = React.createClass({

    deleteGameResult: function() {

        $.ajax({
            url: "/server/tournament/" + this.props.tournamentHash + "/tournamentRound/" + this.props.roundHash + "/gameResult/" + this.props.game.hash,
            type: 'DELETE',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.props.reloadList();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });

    },

    render: function() {

        var teamA = _.find(this.props.teams, {hash: this.props.game.game[0]});
        var teamB = _.find(this.props.teams, {hash: this.props.game.game[1]});

        var teamATitle = (teamA && teamA.title) ? teamA.title : '';
        var teamBTitle = (teamB && teamB.title) ? teamB.title : '';

        var teamAScore = null;
        var teamAResult = _.find(this.props.game.results, {teamHash: this.props.game.game[0]});
        if (teamAResult && !_.isUndefined(teamAResult.score)) {
            teamAScore = teamAResult.score;
        }

        var teamBScore = null;
        var teamBResult = _.find(this.props.game.results, {teamHash: this.props.game.game[1]});
        if (teamBResult && !_.isUndefined(teamBResult.score)) {
            teamBScore = teamBResult.score;
        }

        var gameAddResultUrl = "/client/tournament/" + this.props.tournamentHash + "/round/" + this.props.roundHash + "/game/result/" + this.props.game.hash;

        return (
            <tr>
                <td>{this.props.roundNumber}</td>
                <td>{teamATitle}</td>
                <td>{teamAScore}</td>
                <td>{teamBTitle}</td>
                <td>{teamBScore}</td>
                <td><Link to={gameAddResultUrl} className="btn btn-warning">Add</Link>&nbsp;<a href="#" className="btn btn-danger" onClick={this.deleteGameResult}>Delete</a></td>
            </tr>
        );
    }
});

module.exports = AdminGameResultListRow;
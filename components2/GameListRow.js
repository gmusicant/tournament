var React = require('react');
var Link = require('react-router').Link;
var _ = require('lodash');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Label = require('react-bootstrap').Label;

var GameListRow = React.createClass({
    render: function() {

        var scoreA, scoreB;

        var teamA = _.find(this.props.teams, {hash: this.props.game.game[0]});
        var teamB = _.find(this.props.teams, {hash: this.props.game.game[1]});

        var resultA = _.find(this.props.game.results, {teamHash: teamA.hash});
        var resultB = _.find(this.props.game.results, {teamHash: teamB.hash});

        var labelType;
        if ((resultA && resultB && resultA.score == resultB.score))
            labelType = 'warning';

        if (resultA) {

            labelType = (labelType !== 'warning' && resultB && resultA.score > resultB.score) ? 'success' : 'danger';
            scoreA = (
                <Label bsStyle={labelType}>{resultA.score}</Label>
            );

        }

        if (resultB) {

            labelType = (labelType !== 'warning' && resultA && resultA.score < resultB.score) ? 'success' : 'danger';
            scoreB = (
                <Label bsStyle={labelType}>{resultB.score}</Label>
            );

        }

        var teamATitle = (teamA && teamA.title) ? teamA.title : '';
        var teamBTitle = (teamA && teamB.title) ? teamB.title : '';

        var gameAddResultUrl = "/client/tournament/" + this.props.tournamentHash + "/round/" + this.props.roundHash + "/game/result/" + this.props.game.hash;

        return (
            <Col xs={12} md={4} className="text-center">
                <Link to={gameAddResultUrl}>
                    <div className="game-list-row">
                        <div className="fieldId">Field {this.props.field}</div>
                        {teamATitle} {scoreA} vs {teamBTitle} {scoreB}
                    </div>
                </Link>
            </Col>
        );
    }
});

module.exports = GameListRow;
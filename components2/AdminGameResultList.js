var React = require('react');
var Link = require('react-router').Link;
var AdminGameResultListRow = require('./AdminGameResultListRow.js');
var Grid = require('react-bootstrap').Grid;
var Table = require('react-bootstrap').Table;
var browserHistory = require('react-router').browserHistory;

var GameList = React.createClass({

    getInitialState: function() {
        return {
            tournamentRounds: [],
            teams: []
        };
    },

    componentDidMount: function() {
        $.ajax({
            url: '/server/tournament/' + this.props.params.tournamentHash + '/team/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({teams: data.teams});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });

        $.ajax({
            url: '/server/tournament/' + this.props.params.tournamentHash + '/tournamentRound/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                if (data.tournamentRounds) {
                    this.setState({tournamentRounds: data.tournamentRounds});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });
    },

    startNewRound: function () {
        $.ajax({
            url: '/server/tournament/' + this.props.params.tournamentHash + '/tournamentRound/shuffle',
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function(data) {
                if (data.tournamentRound) {
                    var tournamentRounds = this.state.tournamentRounds;
                    tournamentRounds.push(data.tournamentRound);
                    this.setState({tournamentRounds: tournamentRounds});
                } else {
                    //todo error message can't start new round
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });
    },

    deleteLastRound: function() {

        var lastRound = _.last(this.state.tournamentRounds);
        if (lastRound) {

            if (_.sum(_.map(lastRound.games, function(game) {
                if (game && !_.isUndefined(game.results) && game.results.length) {
                    return (!_.isNull(game.results[0].score) || !_.isNull(game.results[1].score));
                }
                return false;
            }))) {
                // last round has results
                alert('We can\'t delete round with results. Please, delete all results from last round then press this button again.');
            } else {
                // last round hasn't results
                $.ajax({
                    url: "/server/tournament/" + this.props.params.tournamentHash + "/tournamentRound/" + lastRound.hash,
                    type: 'DELETE',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        this.componentDidMount();
                    }.bind(this),
                    error: function(xhr, status, err) {
                        console.error(this.props, status, err.toString());
                    }.bind(this)
                });
            }

        }

    },

    addCustomRound: function() {

        var lastRound = _.last(this.state.tournamentRounds);
        if (lastRound) {

            if (_.sum(_.map(lastRound.games, function(game) {
                if (!_.isUndefined(game.results) && game.results.length) {
                    return (_.isNull(game.results[0].score) || _.isNull(game.results[1].score));
                }
                return true;
            }))) {
                // last round has results
                alert('We can\'t add new round until this round did not finish. Please, add all results for last round then press this button again.');
            } else {
                // last round hasn't results
                browserHistory.push('/client/tournament/' + this.props.params.tournamentHash + '/admin/round/add');
            }

        } else {
            browserHistory.push('/client/tournament/' + this.props.params.tournamentHash + '/admin/round/add');
        }

    },

    render: function() {

        var rows = [];
        _.forEach(this.state.tournamentRounds, (function(round, roundKey) {
            for (var i=0; i < round.games.length; i++) {
                var rowKey = roundKey + '-' + i;
                rows.push(<AdminGameResultListRow key={rowKey} game={round.games[i]} teams={this.state.teams} roundHash={round.hash} tournamentHash={this.props.params.tournamentHash} roundNumber={roundKey+1} reloadList={this.componentDidMount.bind(this)}/>);
            }
        }).bind(this));

        return (
          <div className="comment">
            <Table striped bordered condensed hover>
            <thead>
                <tr>
                    <th>Round</th>
                    <th>Team A</th>
                    <th>Score A</th>
                    <th>Team B</th>
                    <th>Score B</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
            </Table>
            <div>
                <br/>
                <a className="btn btn-danger" onClick={this.startNewRound}>Start New Round</a>&nbsp;
                <a className="btn btn-danger" onClick={this.deleteLastRound}>Delete Last Round</a>&nbsp;
                <a className="btn btn-warning" onClick={this.addCustomRound}>Add Custom Round</a>&nbsp;
            </div>
          </div>
        );
    }
});

module.exports = GameList;
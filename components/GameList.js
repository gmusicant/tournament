var React = require('react');
var Link = require('react-router').Link;
var GameListRow = require('./GameListRow.js');
var Grid = require('react-bootstrap').Grid;

var GameList = React.createClass({

    getInitialState: function() {
        return {
            tournamentRoundHash: '',
            tournamentRoundNumber: 0,
            games: [],
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
            url: '/server/tournament/' + this.props.params.tournamentHash + '/tournamentRound/last/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                if (data.tournamentRound) {
                    this.setState({games: data.tournamentRound.games, tournamentRoundHash: data.tournamentRound.hash, tournamentRoundNumber: data.tournamentRound.id});
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
                    this.setState({games: data.tournamentRound.games, tournamentRoundHash: data.tournamentRound.hash, tournamentRoundNumber: data.tournamentRound.id});
                } else {
                    //todo error message can't start new round
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });
    },

    render: function() {

        var rows = [];

        if (this.state.teams.length && this.state.games.length) {

            for (var i=0; i < this.state.games.length; i++) {
                rows.push(<GameListRow key={i} field={i+1} game={this.state.games[i]} teams={this.state.teams} roundHash={this.state.tournamentRoundHash} tournamentHash={this.props.params.tournamentHash} reloadList={this.componentDidMount.bind(this)}/>);
            }

        }

        var adminResultsLink = "/client/tournament/" + this.props.params.tournamentHash + "/admin/result/list";

        return (
          <div className="comment">
            <h2 className="text-center">
                Round {this.state.tournamentRoundNumber}
            </h2>
            <br/>
            <Grid>
                {rows}
            </Grid>
            <div>
                <br/>
                <Link to={adminResultsLink} className="btn btn-warning">To Admin Game Results</Link>&nbsp;
                <a className="btn btn-danger" onClick={this.startNewRound}>Start New Round</a>
            </div>
          </div>
        );
    }
});

module.exports = GameList;
var React = require('react');
var Link = require('react-router').Link;
var GameListRow = require('./GameListRow.js');
var Grid = require('react-bootstrap').Grid;
var TournamentResultOlympic = require('./TournamentResultOlympic.js');
var TournamentResultSwiss = require('./TournamentResultSwiss.js');

var TournamentResult = React.createClass({

    getInitialState: function() {
        return {
            tournament: [],
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
            url: '/server/tournament/' + this.props.params.tournamentHash,
            dataType: 'json',
            cache: false,
            success: function(data) {
                if (data.tournament) {
                    this.setState({tournament: data.tournament});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });
    },

    render: function() {

        var roundList = '';

        if (this.state.tournament && this.state.teams) {
            if (this.state.tournament.type == 'swiss') {
                roundList = (<TournamentResultSwiss teams={this.state.teams} tournament={this.state.tournament}/>);
            } else if (this.state.tournament.type == 'olympic') {
                roundList = (<TournamentResultOlympic teams={this.state.teams} tournament={this.state.tournament} location={this.props.location}/>);
            }
        }

        return (
          <div className="comment">
            <div>
                {roundList}
            </div>
          </div>
        );
    }
});

module.exports = TournamentResult;
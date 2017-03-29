var React = require('react');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var _ = require('lodash');

var browserHistory = require('react-router').browserHistory;
var GameResultEditOptions = require('./GameResultEditOptions.js');

var GameResultEdit = React.createClass({

    getInitialState: function() {
        return {
            gameResult: {},
            teams: [],
            teamALable: '',
            teamAValue: 13,
            teamBLable: '',
            teamBValue: 13
        };
    },

    componentDidMount: function() {

        $.ajax({
            url: '/server/tournament/' + this.props.params.tournamentHash + '/team/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({teams: data.teams});
                this.updateTeamParams();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });

        $.ajax({
            url: '/server/tournament/' + this.props.params.tournamentHash + '/tournamentRound/' + this.props.params.roundHash +'/gameResult/' + this.props.params.gameResultHash,
            dataType: 'json',
            cache: false,
            success: function(data) {
                if (data.game && data.game.results) {
                    this.setState({gameResult: data.game.results});
                    this.updateTeamParams();
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });
    },

    updateTeamParams: function() {

        if (this.state.teams.length && this.state.gameResult && this.state.gameResult && _.size(this.state.gameResult) === 2) {

            var newState = {};

            var teamKeys = _.keys(this.state.gameResult);
            if (teamKeys && _.size(teamKeys) == 2) {

                var teamA = _.find(this.state.teams, {hash: teamKeys[0]});
                if (teamA && teamA.title) {
                    newState.teamALable = teamA.title;
                }
                if (this.state.gameResult[teamKeys[0]] && !this.props.isNew) {
                    newState.teamAValue = this.state.gameResult[teamKeys[0]];
                }

                var teamB = _.find(this.state.teams, {hash: teamKeys[1]});
                if (teamB && teamB.title) {
                    newState.teamBLable = teamB.title;
                }
                if (this.state.gameResult[teamKeys[1]] && !this.props.isNew) {
                    newState.teamBValue = this.state.gameResult[teamKeys[1]];
                }

                if (_.size(newState)) {
                    this.setState(newState);
                }
            }

        }

    },

    changeInput: function(teamAB, value) {
        var tmpObj = {};
        tmpObj['team'+teamAB+'Value'] = value;
        this.setState(tmpObj);
    },

    submitForm: function(event) {
        event.preventDefault();

        var data = {};
        var teamKeys = _.keys(this.state.gameResult);
        if (teamKeys && _.size(teamKeys) == 2) {

            data[teamKeys[0]] = this.state.teamAValue;
            data[teamKeys[1]] = this.state.teamBValue;

            $.ajax({
                url: '/server/tournament/' + this.props.params.tournamentHash + '/tournamentRound/' + this.props.params.roundHash +'/gameResult/' + this.props.params.gameResultHash,
                type: 'PUT',
                data: data,
                cache: false,
                success: function(data) {
                    browserHistory.goBack();
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props, status, err.toString());
                }.bind(this)
            });

        }

    },

    cancelEdit: function() {
        browserHistory.goBack();
    },

    render: function() {

        var h2Title = this.props.isNew ? 'Add' : 'Edit';

        return (
          <div className="comment">
            <h2 className="commentAuthor">
              Game Result Edit
            </h2>

            <form>
                <GameResultEditOptions teamLable={this.state.teamALable} teamValue={this.state.teamAValue} changeInput={this.changeInput.bind(this, 'A')} teamAB='A'/>
                <GameResultEditOptions teamLable={this.state.teamBLable} teamValue={this.state.teamBValue} changeInput={this.changeInput.bind(this, 'B')} teamAB='B'/>
                <br/>
                <Button bsStyle="default" onClick={this.cancelEdit}>Cancel</Button>&nbsp;
                <Button bsStyle="warning" onClick={this.submitForm}>{h2Title}</Button>
            </form>

          </div>
        );
    }
});

module.exports = GameResultEdit;
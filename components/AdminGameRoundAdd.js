var React = require('react');
var Input = require('react-bootstrap').Input;
var ButtonInput = require('react-bootstrap').ButtonInput;
var _ = require('lodash');

var browserHistory = require('react-router').browserHistory;
var GameResultEditOptions = require('./GameResultEditOptions.js');

var GameResultEdit = React.createClass({

    getInitialState: function() {
        return {
            games: [],
            baseTeams: [],
            allowedTeams: [],
            gameCount: 0,
            selectValues: []
        };
    },

    componentDidMount: function() {
        $.ajax({
            url: '/server/tournament/' + this.props.params.tournamentHash + '/team/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({baseTeams: data.teams, allowedTeams: _.clone(data.teams)});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });
    },

    changeInput: function(key, event) {

        // update select values
        var selectValues = this.state.selectValues;
        var previousValue = selectValues[key];
        selectValues[key] = event.target.value;
        this.setState({selectValues: selectValues});

        // update allowed values
        var allowedTeams = this.state.allowedTeams;
        var teamIndex = _.findIndex(allowedTeams, {hash: event.target.value});
        if (teamIndex !== -1) {
            allowedTeams.splice(teamIndex, 1);
            this.setState({allowedTeams: allowedTeams});
        }

        if (previousValue) {
            var previousTeam = _.find(this.state.baseTeams, {hash: previousValue});
            if (previousTeam) {
                allowedTeams.push(previousTeam);
                this.setState({allowedTeams: allowedTeams});
            }
        }

    },

    submitForm: function(event) {
        event.preventDefault();
        var data = {
            games: []
        };

        var keys = _.keys(this.state.selectValues);
        var selectValues = this.state.selectValues;
        // var teams = this.state.baseTeams;
        _.forEach(keys, function(key) {

            var roundNumber = key.substring(0, key.length-1);
            var teamHash = selectValues[key];

            if (_.isUndefined(data.games[roundNumber])) {
                data.games[roundNumber] = {
                    game: [],
                    results: []
                }
            }

            data.games[roundNumber].game.push(teamHash);
            data.games[roundNumber].results.push({
                teamHash: teamHash,
                score: null
            });

        });

        if (data.games.length) {
            $.ajax({
                url: '/server/tournament/' + this.props.params.tournamentHash + '/tournamentRound',
                type: 'POST',
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

    addGame: function () {

        this.setState({gameCount: this.state.gameCount + 1});

    },

    cancelEdit: function() {
        browserHistory.goBack();
    },

    getInput: function(teamAB, i) {

        var options = [
            <option key={i + 'empty'} value=''>Select team</option>
        ];
        _.forEach(this.state.allowedTeams, function(team, key) {
            key = i + '' + key;
            options.push(<option key={key} value={team.hash}>{team.title}</option>);
        });
        var selectAValue = this.state.selectValues[i+teamAB] ? this.state.selectValues[i+teamAB] : '';
        if (selectAValue) {
            var team = _.find(this.state.baseTeams, {hash: selectAValue});
            if (team) {
                options.push(<option key={i+''+options.length} value={team.hash}>{team.title}</option>);
            }
        }

        var selectALabel = 'Game ' + (i+1) + ' team ' + teamAB;

        return (
            <Input type="select" label={selectALabel} value={selectAValue} onChange={this.changeInput.bind(this, i+teamAB)}>
                {options}
            </Input>
        );

    },

    render: function() {

        var rows = [];
        for (var i=0; i<this.state.gameCount; i++) {

            var selectA = this.getInput('A', i);
            var selectB = this.getInput('B', i);

            rows.push(
                <div key={i}>
                    {selectA}
                    {selectB}
                </div>
            );
        }


        return (
          <div className="comment">
            <h2 className="commentAuthor">
              Add Round
            </h2>
            <div>
                <ButtonInput type="submit" value="Add Game" onClick={this.addGame}/>
            </div>
            <form onSubmit={this.submitForm}>
                <div>
                    {rows}
                </div>
                <ButtonInput type="reset" value="Cancel" onClick={this.cancelEdit}/>
                <ButtonInput type="submit" value="Add Round" />
            </form>

          </div>
        );
    }
});

module.exports = GameResultEdit;
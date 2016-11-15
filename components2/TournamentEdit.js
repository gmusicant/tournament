var React = require('react');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var browserHistory = require('react-router').browserHistory;
var _ = require('lodash');


var TournamentEdit = React.createClass({

    getInitialState: function() {
        return {
            tournament: {
                title: '',
                description: '',
                type: 'swiss'
                // startDate: Date.new(),
                // endDate: Date.new(),
            },
            tournaments: [],
            importTeamsFrom: '',
            importTeamsPlaces: [],
            importTeamsValue: ''
        };
    },

    componentDidMount: function() {
        if (this.props.isNew !== 'true') {

            $.ajax({
                url: '/server/tournament/' + this.props.params.tournamentHash,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    this.setState({tournament: data.tournament});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props, status, err.toString());
                }.bind(this)
            });

            $.ajax({
                url: '/server/tournament/',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    this.setState({tournaments: data.tournaments});
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

    submitForm: function(event) {
        event.preventDefault();

        var url = "/server/tournament/";
        var method = 'POST';

        if (!this.props.isNew) {
            url = url + this.props.params.tournamentHash;
            method = 'PUT';
        }

        $.ajax({
            url: url,
            type: method,
            data: this.state.tournament,
            cache: false,
            success: function(data) {
                browserHistory.goBack();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });

        if (!this.props.isNew) {

            url = url + '/tournamentRound/importTeams';

            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    importTeamsFrom: this.state.importTeamsFrom,
                    importTeamsPlaces: this.state.importTeamsPlaces,
                },
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

    onChangeInput: function(fieldName, event) {
        this.state.tournament[fieldName] = event.target.value;
        this.setState({tournament: this.state.tournament});
    },

    onChangeTournamentImportFrom: function(event) {
        this.setState({importTeamsFrom: event.target.value});
    },

    onChangeTournamentImportTeams: function(event) {

        var value = event.target.value.replace(/[^\d\,\-\ ]/g, '');
        var teamPlaces = [];

        this.setState({importTeamsValue: value})

        value = event.target.value.replace(' ', '');

        var teamsCommaSplitted = value.split(',');
        _.forEach(teamsCommaSplitted, function(teamCommaSplitted) {
            var teamsMinusSplitted = teamCommaSplitted.split('-');
            if (teamsMinusSplitted.length === 2) {
                if (teamsMinusSplitted[0].trim() && teamsMinusSplitted[1].trim()) {
                    teamPlaces = _.concat(teamPlaces, _.range(teamsMinusSplitted[0], _.toNumber(teamsMinusSplitted[1]) + 1));
                }
            } else if (teamsMinusSplitted.length === 1) {
                if (teamsMinusSplitted[0].trim()) {
                    teamPlaces.push(_.toNumber(teamsMinusSplitted[0].trim()));
                }
            }
        });
        this.setState({importTeamsPlaces: teamPlaces});
    },

    render: function() {

        var h2Title = this.props.isNew ? 'Add' : 'Edit';

        var tournamentRows = _.map(this.state.tournaments, function(tournament) {
            return (
                <option key={tournament.hash} value={tournament.hash}>{tournament.title}</option>
            );
        });
        tournamentRows.push(
            <option key='' value=''>Select tournament for import</option>
        );
        var importTeamsFrom = this.props.isNew ? '' : (
            <Input type="select" label="Import from tournament" value={this.state.importTeamsFrom} onChange={this.onChangeTournamentImportFrom}>
                {tournamentRows}
            </Input>
        );


        var importTeamsPlaces = this.props.isNew ? '' : (
            <Input type="text" value={this.state.importTeamsValue} label="Import team places" placeholder="Example: 1-5, 7, 9-12" onChange={this.onChangeTournamentImportTeams}/>
        );

        var rows = [];
        rows.push(<option key='swiss' value='swiss'>swiss</option>);
        rows.push(<option key='olympic' value='olympic'>olympic</option>);

        return (
          <div className="comment">
            <h2 className="commentAuthor">
              Tournament {h2Title}
            </h2>
            <form>
                <Input type="text" value={this.state.tournament.title} label="Title" placeholder="Enter title" onChange={this.onChangeInput.bind(this, 'title')}/>
                <Input type="select" label="Type" value={this.state.type} onChange={this.onChangeInput.bind(this, 'type')}>
                    {rows}
                </Input>
                {importTeamsFrom}
                {importTeamsPlaces}
                <Button bsStyle="default" onClick={this.cancelEdit}>Cancel</Button>&nbsp;
                <Button bsStyle="warning" onClick={this.submitForm}>{h2Title}</Button>
            </form>
          </div>
        );
    }
});

module.exports = TournamentEdit;
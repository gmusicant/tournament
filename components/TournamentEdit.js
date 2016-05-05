var React = require('react');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var browserHistory = require('react-router').browserHistory;


var TournamentEdit = React.createClass({

    getInitialState: function() {
        return {
            tournament: {
                title: '',
                description: '',
                type: 'swiss'
                // startDate: Date.new(),
                // endDate: Date.new(),
            }
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

    },

    onChangeInput: function(fieldName, event) {
        this.state.tournament[fieldName] = event.target.value;
        this.setState({tournament: this.state.tournament});
    },

    render: function() {

        var h2Title = this.props.isNew ? 'Add' : 'Edit';

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
                <Button bsStyle="default" onClick={this.cancelEdit}>Cancel</Button>&nbsp;
                <Button bsStyle="warning" onClick={this.submitForm}>{h2Title}</Button>
            </form>
          </div>
        );
    }
});

module.exports = TournamentEdit;
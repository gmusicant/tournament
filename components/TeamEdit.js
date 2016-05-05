var React = require('react');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var browserHistory = require('react-router').browserHistory;


var TeamEdit = React.createClass({

    getInitialState: function() {
        return {
            team: {
                title: ''
            }
        };
    },

    componentDidMount: function() {
        if (this.props.isNew !== 'true') {

            $.ajax({
                url: '/server/tournament/' + this.props.params.tournamentHash + '/team/' + this.props.params.teamHash,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    this.setState({team: data.team});
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

        var url = "/server/tournament/" + this.props.params.tournamentHash + "/team/";
        var method = 'POST';

        if (!this.props.isNew) {
            url = url + this.props.params.teamHash;
            method = 'PUT';
        }

        $.ajax({
            url: url,
            type: method,
            data: this.state.team,
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
        this.state.team[fieldName] = event.target.value;
        this.setState({team: this.state.team});
    },

    render: function() {

        var h2Title = this.props.isNew ? 'Add' : 'Edit';

        return (
          <div className="comment">
            <h2 className="commentAuthor">
              Team {h2Title}
            </h2>
            <form>
                <Input type="text" value={this.state.team.title} label="Title" placeholder="Enter title" onChange={this.onChangeInput.bind(this, 'title')}/>
                <Button bsStyle="default" onClick={this.cancelEdit}>Cancel</Button>&nbsp;
                <Button bsStyle="warning" onClick={this.submitForm}>{h2Title}</Button>
            </form>
          </div>
        );
    }
});

module.exports = TeamEdit;
var React = require('react');
var Table = require('react-bootstrap').Table;
var TeamListRow = require('./TeamListRow.js');
var Link = require('react-router').Link;

var TeamList = React.createClass({
  getInitialState: function() {
    return {
        teams: []
    };
  },

  componentDidMount: function() {
        $.ajax({
            url: '/server/tournament/' + this.props.params.tournamentHash + '/team',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({teams: data.teams});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });
    },

  render: function() {
    var rows = [];
    for (var i=0; i < this.state.teams.length; i++) {
        if (this.state.teams[i].active) {
            rows.push(<TeamListRow key={i} team={this.state.teams[i]} tournamentHash={this.props.params.tournamentHash} reloadList={this.componentDidMount.bind(this)}/>);
        }
    }

    var addTeamUrl = "/client/tournament/" + this.props.params.tournamentHash + "/team/add";

    return (
      <div className="comment">
        <div>
            <Link to={addTeamUrl} className="btn btn-warning">Add New</Link>
            <br/>
            <br/>
        </div>
        <Table striped bordered condensed hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
      </div>
    );
  }
});

module.exports = TeamList;
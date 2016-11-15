var React = require('react');
var Link = require('react-router').Link;

var TeamListRow = React.createClass({
    deleteTeam: function(hash) {
        $.ajax({
            url: '/server/tournament/' + this.props.tournamentHash + '/team/' + hash,
            type: 'DELETE',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.props.reloadList();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <tr>
                <td>
                    {this.props.team.teamNumber}
                </td>
                <td>
                    {this.props.team.title}
                </td>
                <td>
                    <a className="btn btn-danger" href="#" onClick={this.deleteTeam.bind(this, this.props.team.hash)}>Delete</a>&nbsp;
                    <Link to={`/client/tournament/${this.props.tournamentHash}/team/${this.props.team.hash}`} className="btn btn-warning">Edit</Link>&nbsp;
                </td>
            </tr>
        );
    }
});

module.exports = TeamListRow;
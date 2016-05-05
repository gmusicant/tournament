var React = require('react');
var Link = require('react-router').Link;

var TournamentListRow = React.createClass({
    deleteTournament: function(hash) {
        $.ajax({
            url: '/server/tournament/' + hash,
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
                    {this.props.id}
                </td>
                <td>
                    {this.props.tournament.title}
                </td>
                <td>
                    <a className="btn btn-danger" href="#" onClick={this.deleteTournament.bind(this, this.props.tournament.hash)}>Delete</a>&nbsp;
                    <Link to={`/client/tournament/${this.props.tournament.hash}`} className="btn btn-warning">Edit</Link>&nbsp;
                    <Link to={`/client/tournament/${this.props.tournament.hash}/team/list`} className="btn btn-success">Go</Link>
                </td>
            </tr>
        );
    }
});

module.exports = TournamentListRow;
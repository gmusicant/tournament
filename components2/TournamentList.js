var React = require('react');
var Table = require('react-bootstrap').Table;
var TournamentListRow = require('./TournamentListRow.js');
var Link = require('react-router').Link;


var TournamentList = React.createClass({
    getInitialState: function() {
        return {
            tournaments: []
        };
    },
    componentDidMount: function() {
        $.ajax({
            url: '/server/tournament',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({tournaments: data.tournaments});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        var rows = [];
        for (var i=0; i < this.state.tournaments.length; i++) {
            rows.push(<TournamentListRow key={i} id={i+1} tournament={this.state.tournaments[i]} reloadList={this.componentDidMount.bind(this)}/>);
        }
        return (
          <div className="comment">
            <div>
                <Link to={`/client/tournament/add`} className="btn btn-warning">Add New</Link>
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

module.exports = TournamentList;
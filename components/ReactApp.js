var React = require('react');
var CommentBox = require('./CommentBox');
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var browserHistory = require('react-router').browserHistory;

var TournamentList = require('./TournamentList.js');
var TeamList = require('./TeamList.js');
var GameList = require('./GameList.js');

var ReactApp = React.createClass({

    handleSelect: function(activeKey, href) {
        browserHistory.push(href);
    },

    render: function (){

        var teamListUrl = '/client/tournament/' + this.props.params.tournamentHash + '/team/list/';
        var gameListUrl = '/client/tournament/' + this.props.params.tournamentHash + '/game/list/';
        var tournamentListUrl = '/client/tournament/list/' + this.props.params.tournamentHash;
        var tournamentResultUrl = '/client/tournament/result/' + this.props.params.tournamentHash;
        var disambeTournamentLinks = !this.props.params.tournamentHash;

        return (
            <div>
                <h1>Petanque calculator</h1>
                <Nav bsStyle="tabs" activeHref={this.props.location.pathname} onSelect={this.handleSelect}>
                    <NavItem eventKey={1} href={teamListUrl} title="Team list" disabled={disambeTournamentLinks}>Team list</NavItem>
                    <NavItem eventKey={2} href={gameListUrl} title="Game list" disabled={disambeTournamentLinks}>Game list</NavItem>
                    <NavItem eventKey={2} href={tournamentResultUrl} title="Tournament result" disabled={disambeTournamentLinks}>Tournament result</NavItem>
                    <NavItem eventKey={3} href={tournamentListUrl} title="Tournament list">Tournament list</NavItem>
                </Nav>
                {this.props.children}
            </div>
        )
    }

});

module.exports = ReactApp;
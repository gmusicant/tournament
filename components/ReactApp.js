var React = require('react');
var CommentBox = require('./CommentBox');
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var browserHistory = require('react-router').browserHistory;

var TournamentList = require('./TournamentList.js');
var TeamList = require('./TeamList.js');
var GameList = require('./GameList.js');

var ReactApp = React.createClass({

    handleSelect: function(activeKey, href) {
        browserHistory.push(href);
    },

    getInitialState: function() {
        return {
            tournamentTitle: 'Petanque Calculator',
            titleLoaded: false
        };
    },

    componentDidMount: function() {
        $.ajax({
            url: '/server/tournament/' + this.props.params.tournamentHash,
            dataType: 'json',
            cache: false,
            success: function(data) {
                if (data.tournament) {
                    this.setState({tournamentTitle: data.tournament.title, titleLoaded: true});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });
    },

    render: function (){

        var teamListUrl = '/client/tournament/' + this.props.params.tournamentHash + '/team/list/';
        var gameListUrl = '/client/tournament/' + this.props.params.tournamentHash + '/game/list/';
        var tournamentListUrl = '/client/tournament/list/' + this.props.params.tournamentHash;
        var tournamentResultUrl = '/client/tournament/result/' + this.props.params.tournamentHash;
        var disambeTournamentLinks = !this.props.params.tournamentHash;
        var microTitle, nav;

        if (this.state.titleLoaded) {
            microTitle = (
                <small>Petanque Calculator</small>
            );
        }

        nav = '';
        if (!this.props.location.query || !this.props.location.query.iframe) {
            nav = (<Nav bsStyle="tabs" activeHref={this.props.location.pathname} onSelect={this.handleSelect}>
                <NavItem eventKey={1} href={teamListUrl} title="Team list" disabled={disambeTournamentLinks}>Team list</NavItem>
                <NavItem eventKey={2} href={gameListUrl} title="Game list" disabled={disambeTournamentLinks}>Game list</NavItem>
                <NavItem eventKey={2} href={tournamentResultUrl} title="Tournament result" disabled={disambeTournamentLinks}>Tournament result</NavItem>
                <NavItem eventKey={3} href={tournamentListUrl} title="Tournament list">Tournament list</NavItem>
            </Nav>);
        }

        return (
            <div>
                <div className="text-right float-right">
                    {microTitle}
                </div>
                <h1>{this.state.tournamentTitle}</h1>
                {nav}
                {this.props.children}
            </div>
        )
    }

});

module.exports = ReactApp;
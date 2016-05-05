var React = require('react');
var TournamentEdit = require('./TournamentEdit.js');

module.exports = React.createClass({
    render: function() {
        return (
            <TournamentEdit isNew="true"/>
        );
    }
});

var React = require('react');
var TeamEdit = require('./TeamEdit.js');

module.exports = React.createClass({
    render: function() {
        return (
            <TeamEdit isNew="true" params={this.props.params}/>
        );
    }
});

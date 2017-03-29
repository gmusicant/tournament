var React = require('react');
var GameResultEdit = require('./GameResultEdit.js');

module.exports = React.createClass({
    render: function() {
        return (
            <GameResultEdit isNew="true" params={this.props.params}/>
        );
    }
});

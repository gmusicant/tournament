var React = require('react');
var _ = require('lodash');

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;



module.exports = React.createClass({
    render: function() {

        var allowedValues = _.range(0, 14, 1);
        var rows = [];
        var teamAB = this.props.teamAB;
        var teamValue = this.props.teamValue;
        var changeInput = this.props.changeInput;
        _.forEach(allowedValues, function(value, key) {
            key = teamAB + key;
            var bsStyle = "default";
            if (teamValue == value) {
                bsStyle = "success";
            }
            rows.push(<Button key={key} bsStyle={bsStyle} onClick={changeInput.bind(null, value)}>{value}</Button>);
        });

        return (
            <div>
                <div>
                    {this.props.teamLable}
                </div>
                <div>
                    {rows}
                </div>
            </div>
        );
    }
});

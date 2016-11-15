import React, { Component } from 'react'
import _ from 'lodash'

import TeamListRow from './TeamListRow'

export default class TeamList extends Component {

    render() {

        const { teams } = this.props

        return (
            <div>
                Some state changes:
                {_.map(teams, (team, index) => {
                    return <TeamListRow team={team} key={index} />
                })}
            </div>)
    }
}
import React, { Component } from 'react'
import _ from 'lodash'

import TeamListRow from './TeamListRow'

export default class TeamList extends Component {

    render() {

        const { teams, openTeamsForm, selectTeamForEdit } = this.props;

        return (
            <div className="container">
                <div>
                    <div>
                        <button className="btn btn-warning" onClick={ openTeamsForm }>Add team</button>
                    </div>
                </div>
                <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>title</th>
                                <th>action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {_.map(teams, (team, index) => {
                                return <TeamListRow team={team} key={index} position={index+1} openTeamsForm={openTeamsForm} />
                            })}
                        </tbody>
                    </table>
                </div>
            </div>)
    }
}
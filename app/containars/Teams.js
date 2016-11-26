import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import TeamList from './../components/TeamList'
import { listTeams } from './../actions/teams'

class Teams extends Component {

    componentWillMount() {
        this.props.listTeams(this.props.currentTournamentHash)
    }

    render() {
        const { teams } = this.props;
        const selectTeamForEdit = () => {};
        return (
            <TeamList teams={teams} selectTeamForEdit={selectTeamForEdit} />
        )
    }
}

export default connect(
  (state, optParams) => {
    const teams = state.teams && state.teams.teams && state.teams.teams[optParams.params.tournamentHash];
    return  { teams, currentTournamentHash: optParams.params.tournamentHash }
  },
  { listTeams }
)(Teams)

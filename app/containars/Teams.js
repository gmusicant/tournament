import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import TeamList from './../components/TeamList'
import { teamList } from './../actions/teams'

import { browserHistory } from 'react-router'


const openTeamsForm = (tournamentHash, team) => {
    // todo clean edit form. we can do this on cancel
    if (team && team.hash && tournamentHash)
        return browserHistory.push(`/client/${tournamentHash}/teams/${team.hash}/edit`);
    else
        return browserHistory.push(`/client/${tournamentHash}/teams/add`);
}

class Teams extends Component {

    componentWillMount() {
        this.props.teamList(this.props.currentTournamentHash)
    }

    render() {
        const { teams, currentTournamentHash } = this.props;
        return (
            <TeamList teams={teams} openTeamsForm={openTeamsForm.bind(this, currentTournamentHash)} tournamentHash={currentTournamentHash} />
        )
    }
}

export default connect(
  (state, optParams) => {
    const teams = state.teams && state.teams.teams && state.teams.teams[optParams.params.tournamentHash];
    return  { teams, currentTournamentHash: optParams.params.tournamentHash }
  },
  { teamList }
)(Teams)

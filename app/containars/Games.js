import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import GameList from './../components/GameList'
import { roundLast } from './../actions/rounds'
import { teamList } from './../actions/teams'

import { browserHistory } from 'react-router'


// const openTeamsForm = (tournamentHash, team) => {
//     // todo clean edit form. we can do this on cancel
//     if (team && team.hash && tournamentHash)
//         return browserHistory.push(`/client/${tournamentHash}/teams/${team.hash}/edit`);
//     else
//         return browserHistory.push(`/client/${tournamentHash}/teams/add`);
// }

class Games extends Component {

    componentWillMount() {
        this.props.roundLast(this.props.currentTournamentHash)
        this.props.teamList(this.props.currentTournamentHash)
    }

    render() {
        const { round, teams, currentTournamentHash } = this.props;
        const roundHash = round.hash ? round.hash : false;
        const games = round.games ? round.games : [];

        return (
            <GameList games={games} teams={teams} roundHash={round.roundHash} tournamentHash={currentTournamentHash} />
        )
    }
}

export default connect(
  (state, optParams) => {
    const round = (state.rounds && state.rounds.last && state.rounds.last[optParams.params.tournamentHash] && state.rounds.last[optParams.params.tournamentHash]) ? state.rounds.last[optParams.params.tournamentHash] : {};
    const teams = (state.teams && state.teams.teams && state.teams.teams[optParams.params.tournamentHash]) ? state.teams.teams[optParams.params.tournamentHash] : {};
    return  { round, teams, currentTournamentHash: optParams.params.tournamentHash }
  },
  { roundLast, teamList }
)(Games)

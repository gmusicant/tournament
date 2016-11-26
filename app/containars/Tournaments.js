import React, { Component } from 'react'
import { connect } from 'react-redux'
import { listTournaments, createTournament } from '../actions/tournaments'
import _ from 'lodash'
import TournamentList from '../components/TournamentList'
import { browserHistory } from 'react-router'

const openTournamentForm = (tournament) => {
    // todo clean edit form. we can do this on cancel
    if (tournament && tournament.hash)
        return browserHistory.push(`/client/${tournament.hash}/edit`);
    else
        return browserHistory.push(`/client/tournaments/add`);
}

class Tournaments extends Component {

    componentWillMount() {
        this.props.listTournaments()
    }

    render() {
        const {tournaments, listTournaments, createTournament } = this.props
        return (
            <TournamentList tournaments={tournaments} listTournaments={listTournaments} openTournamentForm={openTournamentForm} createTournament={createTournament} />
        )
    }
}

export default connect(
  state => ({ tournaments: state.tournaments.tournaments }),
  { listTournaments, createTournament, openTournamentForm }
)(Tournaments)

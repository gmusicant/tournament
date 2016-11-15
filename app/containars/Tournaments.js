import React, { Component } from 'react'
import { connect } from 'react-redux'
import { listTournaments, createTournament } from '../actions/tournaments'
import _ from 'lodash'
import TournamentList from '../components/TournamentList'
import { browserHistory } from 'react-router'

const openTournamentForm = () => {
    // todo clean edit form
    return browserHistory.push(`/client/tournaments/add`);
}

const selectTournamentForEdit = (tournament) => {
    return browserHistory.push(`/client/${tournament.hash}/edit`);
}

class Tournaments extends Component {

    componentWillMount() {
        this.props.listTournaments()
    }

    render() {
        const {tournaments, listTournaments, createTournament } = this.props
        return (
            <TournamentList tournaments={tournaments} listTournaments={listTournaments} openTournamentForm={openTournamentForm} createTournament={createTournament} selectTournamentForEdit={selectTournamentForEdit} />
        )
    }
}

export default connect(
  state => ({ tournaments: state.tournaments.tournaments }),
  { listTournaments, createTournament, openTournamentForm }
)(Tournaments)

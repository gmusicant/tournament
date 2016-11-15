import _ from 'lodash'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Field, reduxForm } from 'redux-form';
import { createTournament, updateTournament, deleteTournament } from '../actions/tournaments'
import TournamentForm from '../components/TournamentForm'

const cancelButton = (event) => {
    // todo: clean edit form
    event.preventDefault();
    return browserHistory.goBack();
}

const selectTournament = (hash, tournaments) => {
    const tournament = _.find(tournaments.tournaments, { hash });
    if (!_.isEmpty(tournament))
        return tournament;
    else
        return {};
}

class TournamentEdit extends Component {

    render() {
        const { handleSubmit, createTournament, updateTournament, tournaments, params, deleteTournament } = this.props

        const tournamentInit = selectTournament(params.tournamentHash, tournaments);

        const saveTournament = (tournament) => {

            if (_.isEmpty(tournamentInit))
                createTournament(tournament)
            else
                updateTournament(tournament)

            browserHistory.push(`/client`);
        };

        const deleteTournamentWrapped = (hash, event) => {
            event.preventDefault();
            deleteTournament(hash);
            browserHistory.push(`/client`);
        }

        return (
            <TournamentForm init handleSubmit={handleSubmit} cancelButton={cancelButton} deleteButton={deleteTournamentWrapped} saveTournament={saveTournament} tournament={tournamentInit} deleteTournament={deleteTournamentWrapped} />
          )
    }
}

const TournamentEditConst = reduxForm({
  form: 'TournamentEdit'  // a unique identifier for this form
})(TournamentEdit)

export default connect(
  (state, optParams) => {
    return {
        tournaments: state.tournaments,
        initialValues: selectTournament(optParams.params.tournamentHash, state.tournaments)
    }
  },
  { createTournament, updateTournament, cancelButton, deleteTournament }
)(TournamentEditConst)

import _ from 'lodash'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Field, reduxForm } from 'redux-form';
import { createTournament, updateTournament, deleteTournament, tournamentGet } from '../actions/tournaments'
import TournamentForm from '../components/TournamentForm'

const cancelButton = (event) => {
    // todo: clean edit form
    event.preventDefault();
    return browserHistory.goBack();
}

class TournamentEdit extends Component {

    componentWillMount() {
        const { dispatch, params, tournamentGet } = this.props;
        if (params.tournamentHash) {
            dispatch(tournamentGet(params.tournamentHash));
        }
    }

    render() {
        const { handleSubmit, createTournament, updateTournament, params, deleteTournament, currentTournament, dispatch } = this.props

        const saveTournament = (tournament) => {

            if (_.isEmpty(currentTournament))
                dispatch(createTournament(tournament));
            else
                dispatch(updateTournament(tournament));

            browserHistory.push(`/client`);
        };

        const deleteTournamentWrapped = (hash, event) => {
            event.preventDefault();
            dispatch(deleteTournament(hash));
            browserHistory.push(`/client`);
        }

        return (
            <TournamentForm init handleSubmit={handleSubmit} cancelButton={cancelButton} deleteButton={deleteTournamentWrapped} saveTournament={saveTournament} tournament={currentTournament} deleteTournament={deleteTournamentWrapped} />
          )
    }
}

const TournamentEditConst = reduxForm({
  form: 'TournamentEdit',  // a unique identifier for this form,
  enableReinitialize: true
})(TournamentEdit)

export default connect(
  (state, optParams) => {
    const currentTounament = (_.isEmpty(optParams.params.tournamentHash)) ? {} : state.tournaments.currentTournament;
    return {
        currentTournament: currentTounament,
        initialValues: currentTounament
    }
  },
  () => {
    return { createTournament, updateTournament, cancelButton, deleteTournament, tournamentGet }
  }
)(TournamentEditConst)

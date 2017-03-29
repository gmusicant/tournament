import _ from 'lodash'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Field, reduxForm } from 'redux-form';
import { tournamentCreate, tournamentUpdate, tournamentDelete, tournamentGet } from '../actions/tournaments'
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
        const { handleSubmit, tournamentCreate, tournamentUpdate, params, tournamentDelete, currentTournament, dispatch } = this.props

        const saveTournament = (tournament) => {

            if (_.isEmpty(currentTournament))
                dispatch(tournamentCreate(tournament));
            else
                dispatch(tournamentUpdate(tournament));

            browserHistory.push(`/client`);
        };

        const tournamentDeleteWrapped = (hash, event) => {
            event.preventDefault();
            dispatch(tournamentDelete(hash));
            browserHistory.push(`/client`);
        }

        return (
            <TournamentForm init handleSubmit={handleSubmit} cancelButton={cancelButton} deleteButton={tournamentDeleteWrapped} saveTournament={saveTournament} tournament={currentTournament} />
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
    return { tournamentCreate, tournamentUpdate, cancelButton, tournamentDelete, tournamentGet }
  }
)(TournamentEditConst)

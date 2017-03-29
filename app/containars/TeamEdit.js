import _ from 'lodash'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Field, reduxForm } from 'redux-form';
import { teamCreate, teamUpdate, teamDelete, teamGet } from '../actions/teams'
import TeamForm from '../components/TeamForm'

const cancelButton = (event) => {
    // todo: clean edit form
    event.preventDefault();
    return browserHistory.goBack();
}

class TeamEdit extends Component {

    componentWillMount() {
        const { dispatch, params, teamGet } = this.props;
        if (params.tournamentHash && params.teamHash) {
            dispatch(teamGet(params.tournamentHash, params.teamHash));
        }
    }

    render() {
         const { handleSubmit, params, currentTeam, dispatch, teamCreate, teamUpdate, cancelButton, teamDelete } = this.props

        const saveTeam = (team) => {

            if (_.isEmpty(currentTeam))
                dispatch(teamCreate(params.tournamentHash, team));
            else
                dispatch(teamUpdate(params.tournamentHash, team));

            browserHistory.push(`/client/${params.tournamentHash}/teams`);
        };

        const deleteTeamWrapped = (tournamentHash, teamHash, event) => {
            event.preventDefault();
            dispatch(teamDelete(tournamentHash, teamHash));
            browserHistory.push(`/client/${tournamentHash}/teams`);
        }

        return (
            <TeamForm init handleSubmit={handleSubmit} deleteButton={deleteTeamWrapped} tournamentHash={params.tournamentHash} team={currentTeam} saveTeam={saveTeam} cancelButton={cancelButton} />
        )
    }
}

const TeamEditConst = reduxForm({
  form: 'TeamEdit',  // a unique identifier for this form,
  enableReinitialize: true
})(TeamEdit)

export default connect(
  (state, optParams) => {
    const currentTeam = (_.isEmpty(optParams.params.teamHash)) ? {} : state.teams.currentTeam;
    return {
        currentTeam: currentTeam,
        initialValues: currentTeam
    }
  },
  () => {
    return { teamCreate, teamUpdate, cancelButton, teamDelete, teamGet }
  }
)(TeamEditConst)

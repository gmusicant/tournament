import { START_FETCH_LIST_TEAM, SUCCESS_FETCH_LIST_TEAM, FAIL_FETCH_LIST_TEAM } from '../constants'
import _ from 'lodash'

function startFetchTeams(tournamentHash) {
    return {
        type: START_FETCH_LIST_TEAM,
        status: 'start',
        tournamentHash
    }
}

function successFetchTeams(teams, tournamentHash) {
    return {
        type: SUCCESS_FETCH_LIST_TEAM,
        status: 'success',
        teams,
        tournamentHash
    }
}

function failFetchTeams(error) {
    return {
        type: FAIL_FETCH_LIST_TEAM,
        status: 'fail',
        error: error
    }
}

export const listTeams = (tournamentHash) => {
    return function (dispatch, getState) {

        const state = getState();

        if (state.teams && state.teams.teams && _.isEmpty(state.teams.teams[tournamentHash])) {

            dispatch(startFetchTeams())

            fetch(`/server/tournament/${tournamentHash}/team`)
                .then(response => response.json())
                .then(teams => {
                    dispatch(successFetchTeams(teams, tournamentHash))
                })
                .catch(error => {
                    dispatch(failFetchTeams(error))
                });
        }
    }
}

import { START_FETCH_LIST_TEAM, SUCCESS_FETCH_LIST_TEAM, FAIL_FETCH_LIST_TEAM,
    START_CREATE_TEAM, SUCCESS_CREATE_TEAM, FAIL_CREATE_TEAM,
    START_GET_TEAM, SUCCESS_GET_TEAM, FAIL_GET_TEAM,
    START_UPDATE_TEAM, SUCCESS_UPDATE_TEAM, FAIL_UPDATE_TEAM,
    START_DELETE_TEAM, SUCCESS_DELETE_TEAM, FAIL_DELETE_TEAM } from '../constants'
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
                    teams.teams = _.filter(teams.teams, (team) => {
                        return team.active === true;
                    });
                    return teams
                })
                .then(teams => {
                    dispatch(successFetchTeams(teams, tournamentHash))
                })
                .catch(error => {
                    dispatch(failFetchTeams(error))
                });
        }
    }
}

function startCreateTeam(tournamentHash, team) {
    return {
        type: START_CREATE_TEAM,
        status: 'start',
        team,
        tournamentHash
    }
}

function successCreateTeam(tournamentHash, team) {
    return {
        type: SUCCESS_CREATE_TEAM,
        status: 'success',
        team,
        tournamentHash
    }
}

function failCreateTeam(error) {
    return {
        type: FAIL_CREATE_TEAM,
        status: 'fail',
        error: error
    }
}

export const createTeam = (tournamentHash, team) => {
    return function (dispatch, getState) {

        const state = getState();

        dispatch(startCreateTeam(tournamentHash, team))

        fetch(`/server/tournament/${tournamentHash}/team`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(team)
            })
            .then(response => response.json())
            .then(team => team.team)
            .then(team => {
                dispatch(successCreateTeam(tournamentHash, team));
                if (_.isEmpty(state.teams.teams[tournamentHash])) {
                    dispatch(listTeams(tournamentHash));
                }
            })
            .catch(error => {
                dispatch(failFetchTeams(error))
            });
    }
}

function startUpdateTeam(tournamentHash, teamHash) {
    return {
        type: START_UPDATE_TEAM,
        status: 'start',
        teamHash,
        tournamentHash
    }
}

function successUpdateTeam(tournamentHash, team) {
    return {
        type: SUCCESS_UPDATE_TEAM,
        status: 'success',
        team,
        tournamentHash
    }
}

function errorUpdateTeam(error) {
    return {
        type: FAIL_UPDATE_TEAM,
        status: 'fail',
        error: error
    }
}

export const updateTeam = (tournamentHash, team) => {
    return function (dispatch, getState) {

        dispatch(startUpdateTeam(tournamentHash, team))

        fetch(`/server/tournament/${tournamentHash}/team/${team.hash}`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(team)
        })
            .then(response => response.json())
            .then(team => team.team)
            .then(team => {
                dispatch(successUpdateTeam(tournamentHash, team))
            })
            .catch(error => {
                dispatch(errorUpdateTeam(error))
            });

    }
}

function startDeleteTeam(tournamentHash, teamHash) {
    return {
        type: START_DELETE_TEAM,
        status: 'start',
        teamHash,
        tournamentHash
    }
}

function successDeleteTeam(tournamentHash, teamHash) {
    return {
        type: SUCCESS_DELETE_TEAM,
        status: 'success',
        teamHash,
        tournamentHash
    }
}

function errorDeleteTeam(error) {
    return {
        type: FAIL_DELETE_TEAM,
        status: 'fail',
        error: error
    }
}

export const deleteTeam = (tournamentHash, teamHash) => {
    return function (dispatch, getState) {

        dispatch(startDeleteTeam(tournamentHash, teamHash))

        fetch(`/server/tournament/${tournamentHash}/team/${teamHash}`, {
            method: 'DELETE'
        })
            .then(() => {
                dispatch(successDeleteTeam(tournamentHash, teamHash))
            })
            .catch(error => {
                dispatch(errorDeleteTeam(error))
            });

    }
}

function startGetTeam(tournamentHash, teamHash) {
    return {
        type: START_GET_TEAM,
        status: 'start',
        teamHash,
        tournamentHash
    }
}

function successGetTeam(tournamentHash, team) {
    return {
        type: SUCCESS_GET_TEAM,
        status: 'success',
        team,
        tournamentHash
    }
}

function failGetTeam(error) {
    return {
        type: FAIL_GET_TEAM,
        status: 'fail',
        error: error
    }
}

export const teamGet = (tournamentHash, teamHash) => {
    return function (dispatch, getState) {

        const state = getState();

        if (state.teams && (_.isEmpty(state.teams.currentTeam) || state.teams.currentTeam.hash !== teamHash)) {

            let currentTeam;

            if (!_.isEmpty(state.teams.teams) && !_.isEmpty(state.teams.teams[tournamentHash])) {

                currentTeam = _.find(state.teams.teams[tournamentHash], {hash: teamHash});

            }

            if (currentTeam) {

                dispatch(startGetTeam(tournamentHash, teamHash))
                dispatch(successGetTeam(tournamentHash, currentTeam));

            } else {

                dispatch(startGetTeam(tournamentHash, teamHash))

                fetch(`/server/tournament/${tournamentHash}/team/${teamHash}`)
                    .then(response => response.json())
                    .then(team => team.team)
                    .then(team => {
                        dispatch(successGetTeam(tournamentHash, team))
                    })
                    .catch(error => {
                        dispatch(failGetTeam(error))
                    });

            }

        }
    }
}
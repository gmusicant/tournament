import { START_TEAM_LIST, SUCCESS_TEAM_LIST, FAIL_TEAM_LIST,
    START_TEAM_CREATE, SUCCESS_TEAM_CREATE, FAIL_TEAM_CREATE,
    START_TEAM_GET, SUCCESS_TEAM_GET, FAIL_TEAM_GET,
    START_TEAM_UPDATE, SUCCESS_TEAM_UPDATE, FAIL_TEAM_UPDATE,
    START_TEAM_DELETE, SUCCESS_TEAM_DELETE, FAIL_TEAM_DELETE } from '../constants'
import _ from 'lodash'

function startFetchTeams(tournamentHash) {
    return {
        type: START_TEAM_LIST,
        status: 'start',
        tournamentHash
    }
}

function successFetchTeams(teams, tournamentHash) {
    return {
        type: SUCCESS_TEAM_LIST,
        status: 'success',
        teams,
        tournamentHash
    }
}

function failFetchTeams(error) {
    return {
        type: FAIL_TEAM_LIST,
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
        type: START_TEAM_CREATE,
        status: 'start',
        team,
        tournamentHash
    }
}

function successCreateTeam(tournamentHash, team) {
    return {
        type: SUCCESS_TEAM_CREATE,
        status: 'success',
        team,
        tournamentHash
    }
}

function failCreateTeam(error) {
    return {
        type: FAIL_TEAM_CREATE,
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
        type: START_TEAM_UPDATE,
        status: 'start',
        teamHash,
        tournamentHash
    }
}

function successUpdateTeam(tournamentHash, team) {
    return {
        type: SUCCESS_TEAM_UPDATE,
        status: 'success',
        team,
        tournamentHash
    }
}

function errorUpdateTeam(error) {
    return {
        type: FAIL_TEAM_UPDATE,
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
        type: START_TEAM_DELETE,
        status: 'start',
        teamHash,
        tournamentHash
    }
}

function successDeleteTeam(tournamentHash, teamHash) {
    return {
        type: SUCCESS_TEAM_DELETE,
        status: 'success',
        teamHash,
        tournamentHash
    }
}

function errorDeleteTeam(error) {
    return {
        type: FAIL_TEAM_DELETE,
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
        type: START_TEAM_GET,
        status: 'start',
        teamHash,
        tournamentHash
    }
}

function successGetTeam(tournamentHash, team) {
    return {
        type: SUCCESS_TEAM_GET,
        status: 'success',
        team,
        tournamentHash
    }
}

function failGetTeam(error) {
    return {
        type: FAIL_TEAM_GET,
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
import { START_TEAM_LIST, SUCCESS_TEAM_LIST, FAIL_TEAM_LIST,
    START_TEAM_CREATE, SUCCESS_TEAM_CREATE, FAIL_TEAM_CREATE,
    START_TEAM_GET, SUCCESS_TEAM_GET, FAIL_TEAM_GET,
    START_TEAM_UPDATE, SUCCESS_TEAM_UPDATE, FAIL_TEAM_UPDATE,
    START_TEAM_DELETE, SUCCESS_TEAM_DELETE, FAIL_TEAM_DELETE } from '../constants'
import _ from 'lodash'

function startTeamList(tournamentHash) {
    return {
        type: START_TEAM_LIST,
        status: 'start',
        tournamentHash
    }
}

function successTeamList(teams, tournamentHash) {
    return {
        type: SUCCESS_TEAM_LIST,
        status: 'success',
        teams,
        tournamentHash
    }
}

function failTeamList(error) {
    return {
        type: FAIL_TEAM_LIST,
        status: 'fail',
        error: error
    }
}

export const teamList = (tournamentHash) => {
    return function (dispatch, getState) {

        const state = getState();

        if (state.teams && state.teams.teams && _.isEmpty(state.teams.teams[tournamentHash])) {

            dispatch(startTeamList())

            fetch(`/server/tournament/${tournamentHash}/team`)
                .then(response => response.json())
                .then(teams => {
                    teams.teams = _.filter(teams.teams, (team) => {
                        return team.active === true;
                    });
                    return teams
                })
                .then(teams => {
                    dispatch(successTeamList(teams, tournamentHash))
                })
                .catch(error => {
                    dispatch(failTeamList(error))
                });
        }
    }
}

function startTeamCreate(tournamentHash, team) {
    return {
        type: START_TEAM_CREATE,
        status: 'start',
        team,
        tournamentHash
    }
}

function successTeamCreate(tournamentHash, team) {
    return {
        type: SUCCESS_TEAM_CREATE,
        status: 'success',
        team,
        tournamentHash
    }
}

function failTeamCreate(error) {
    return {
        type: FAIL_TEAM_CREATE,
        status: 'fail',
        error: error
    }
}

export const teamCreate = (tournamentHash, team) => {
    return function (dispatch, getState) {

        const state = getState();

        dispatch(startTeamCreate(tournamentHash, team))

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
                dispatch(successTeamCreate(tournamentHash, team));
                if (_.isEmpty(state.teams.teams[tournamentHash])) {
                    dispatch(teamList(tournamentHash));
                }
            })
            .catch(error => {
                dispatch(failTeamCreate(error))
            });
    }
}

function startTeamUpdate(tournamentHash, teamHash) {
    return {
        type: START_TEAM_UPDATE,
        status: 'start',
        teamHash,
        tournamentHash
    }
}

function successTeamUpdate(tournamentHash, team) {
    return {
        type: SUCCESS_TEAM_UPDATE,
        status: 'success',
        team,
        tournamentHash
    }
}

function failTeamUpdate(error) {
    return {
        type: FAIL_TEAM_UPDATE,
        status: 'fail',
        error: error
    }
}

export const teamUpdate = (tournamentHash, team) => {
    return function (dispatch, getState) {

        dispatch(startTeamUpdate(tournamentHash, team))

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
                dispatch(successTeamUpdate(tournamentHash, team))
            })
            .catch(error => {
                dispatch(failTeamUpdate(error))
            });

    }
}

function startTeamDelete(tournamentHash, teamHash) {
    return {
        type: START_TEAM_DELETE,
        status: 'start',
        teamHash,
        tournamentHash
    }
}

function successTeamDelete(tournamentHash, teamHash) {
    return {
        type: SUCCESS_TEAM_DELETE,
        status: 'success',
        teamHash,
        tournamentHash
    }
}

function failTeamDelete(error) {
    return {
        type: FAIL_TEAM_DELETE,
        status: 'fail',
        error: error
    }
}

export const teamDelete = (tournamentHash, teamHash) => {
    return function (dispatch, getState) {

        dispatch(startTeamDelete(tournamentHash, teamHash))

        fetch(`/server/tournament/${tournamentHash}/team/${teamHash}`, {
            method: 'DELETE'
        })
            .then(() => {
                dispatch(successTeamDelete(tournamentHash, teamHash))
            })
            .catch(error => {
                dispatch(failTeamDelete(error))
            });

    }
}

function startTeamGet(tournamentHash, teamHash) {
    return {
        type: START_TEAM_GET,
        status: 'start',
        teamHash,
        tournamentHash
    }
}

function successTeamGet(tournamentHash, team) {
    return {
        type: SUCCESS_TEAM_GET,
        status: 'success',
        team,
        tournamentHash
    }
}

function failTeamGet(error) {
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

                dispatch(startTeamGet(tournamentHash, teamHash))
                dispatch(successTeamGet(tournamentHash, currentTeam));

            } else {

                dispatch(startTeamGet(tournamentHash, teamHash))

                fetch(`/server/tournament/${tournamentHash}/team/${teamHash}`)
                    .then(response => response.json())
                    .then(team => team.team)
                    .then(team => {
                        dispatch(successTeamGet(tournamentHash, team))
                    })
                    .catch(error => {
                        dispatch(failTeamGet(error))
                    });

            }

        }
    }
}
import fetch from 'isomorphic-fetch'
import _ from 'lodash'
import { CREATE_TOURNAMENT,
    READ_TOURNAMENT,
    UPDATE_TOURNAMENT,
    START_FETCH_LIST_TOURNAMENT, SUCCESS_FETCH_LIST_TOURNAMENT, FAIL_FETCH_LIST_TOURNAMENT,
    START_CREATE_TOURNAMENT, SUCCESS_CREATE_TOURNAMENT, ERROR_CREATE_TOURNAMENT,
    START_UPDATE_TOURNAMENT, SUCCESS_UPDATE_TOURNAMENT, ERROR_UPDATE_TOURNAMENT,
    START_DELETE_TOURNAMENT, SUCCESS_DELETE_TOURNAMENT, ERROR_DELETE_TOURNAMENT,
    START_FETCH_TOURNAMENT, SUCCESS_FETCH_TOURNAMENT, FAIL_FETCH_TOURNAMENT } from '../constants'

function startCreateTournament(tournament) {
    return {
        type: START_CREATE_TOURNAMENT,
        status: 'start',
        tournament
    }
}

function successCreateTournament(tournament) {
    return {
        type: SUCCESS_CREATE_TOURNAMENT,
        status: 'success',
        tournament
    }
}

function errorCreateTournament(error) {
    return {
        type: ERROR_CREATE_TOURNAMENT,
        status: 'error',
        error
    }

}

export const createTournament = (tournament) => {
    return function (dispatch, getState) {

        dispatch(startCreateTournament(tournament))

        fetch('/server/tournament', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(tournament)
        })
            .then(response => response.json())
            .then(tournament => tournament.tournament)
            .then(tournament => {
                dispatch(successCreateTournament(tournament))
            })
            .catch(error => {
                dispatch(errorCreateTournament(error))
            });

    }
}

function startUpdateTournament(tournament) {
    return {
        type: START_UPDATE_TOURNAMENT,
        status: 'start',
        tournament
    }
}

function successUpdateTournament(tournament) {
    return {
        type: SUCCESS_UPDATE_TOURNAMENT,
        status: 'success',
        tournament
    }
}

function errorUpdateTournament(error) {
    return {
        type: ERROR_UPDATE_TOURNAMENT,
        status: 'error',
        error
    }

}

export const updateTournament = (tournament) => {
    return function (dispatch, getState) {

        dispatch(startUpdateTournament(tournament))

        fetch(`/server/tournament/${tournament.hash}`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(tournament)
        })
            .then(response => response.json())
            .then(tournament => tournament.tournament)
            .then(tournament => {
                dispatch(successUpdateTournament(tournament))
            })
            .catch(error => {
                dispatch(errorUpdateTournament(error))
            });

    }
}

function startDeleteTournament(tournamentHash) {
    return {
        type: START_DELETE_TOURNAMENT,
        status: 'start',
        tournamentHash
    }
}

function successDeleteTournament(tournamentHash) {
    return {
        type: SUCCESS_DELETE_TOURNAMENT,
        status: 'success',
        tournamentHash
    }
}

function errorDeleteTournament(error) {
    return {
        type: ERROR_DELETE_TOURNAMENT,
        status: 'error',
        error
    }

}

export const deleteTournament = (tournamentHash) => {
    return function (dispatch, getState) {

        dispatch(startDeleteTournament(tournamentHash))

        fetch(`/server/tournament/${tournamentHash}`, {
            method: 'DELETE'
        })
            .then(() => {
                dispatch(successDeleteTournament(tournamentHash))
            })
            .catch(error => {
                dispatch(errorDeleteTournament(error))
            });

    }
}

function startFetchTournaments() {
    return {
        type: START_FETCH_LIST_TOURNAMENT,
        status: 'start'
    }
}

function successFetchTournaments(tournaments) {
    return {
        type: SUCCESS_FETCH_LIST_TOURNAMENT,
        status: 'success',
        tournaments: tournaments
    }
}

function failFetchTournaments(error) {
    return {
        type: FAIL_FETCH_LIST_TOURNAMENT,
        status: 'fail',
        error: error
    }
}

export const listTournaments = () => {
    return function (dispatch, getState) {

        const state = getState();

        if (state.tournaments && _.isEmpty(state.tournaments.tournaments)) {

            dispatch(startFetchTournaments())

            fetch('/server/tournament')
                .then(response => response.json())
                .then(tournaments => {
                    dispatch(successFetchTournaments(tournaments))
                })
                .catch(error => {
                    dispatch(failFetchTournaments(error))
                });
        }
    }
}

function startFetchTournament() {
    return {
        type: START_FETCH_TOURNAMENT,
        status: 'start'
    }
}

function successFetchTournament(tournament) {
    return {
        type: SUCCESS_FETCH_TOURNAMENT,
        status: 'success',
        tournament: tournament
    }
}

function failFetchTournament(error) {
    return {
        type: FAIL_FETCH_TOURNAMENT,
        status: 'fail',
        error: error
    }
}

export const tournamentGet = (tournamentHash, successCallback) => {
    return function (dispatch, getState) {

        const state = getState();

        if (state.tournaments && _.isEmpty(state.tournaments.currentTournament)) {

            let currentTournament;

            if (!_.isEmpty(state.tournaments.tournaments)) {

                currentTournament = _.find(state.tournaments.tournaments, {hash: tournamentHash});

            }

            if (currentTournament) {

                dispatch(startFetchTournament(tournamentHash))
                dispatch(successFetchTournament(currentTournament));

            } else {

                dispatch(startFetchTournament(tournamentHash))

                fetch(`/server/tournament/${tournamentHash}`)
                    .then(response => response.json())
                    .then(tournament => {
                        dispatch(successFetchTournament(tournament.tournament))
                        successCallback(dispatch, tournament.tournament);
                    })
                    .catch(error => {
                        dispatch(failFetchTournament(error))
                    });

            }
        }
    }
}

import fetch from 'isomorphic-fetch'
import _ from 'lodash'
import { START_TOURNAMENT_LIST, SUCCESS_TOURNAMENT_LIST, FAIL_TOURNAMENT_LIST,
    START_TOURNAMENT_CREATE, SUCCESS_TOURNAMENT_CREATE, ERROR_TOURNAMENT_CREATE,
    START_TOURNAMENT_UPDATE, SUCCESS_TOURNAMENT_UPDATE, ERROR_TOURNAMENT_UPDATE,
    START_TOURNAMENT_DELETE, SUCCESS_TOURNAMENT_DELETE, ERROR_TOURNAMENT_DELETE,
    START_TOURNAMENT_GET, SUCCESS_TOURNAMENT_GET, FAIL_TOURNAMENT_GET } from '../constants'

function startCreateTournament(tournament) {
    return {
        type: START_TOURNAMENT_CREATE,
        status: 'start',
        tournament
    }
}

function successCreateTournament(tournament) {
    return {
        type: SUCCESS_TOURNAMENT_CREATE,
        status: 'success',
        tournament
    }
}

function errorCreateTournament(error) {
    return {
        type: ERROR_TOURNAMENT_CREATE,
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
                if (_.isEmpty(state.tournaments.tournaments)) {
                    dispatch(listTournaments());
                }
            })
            .catch(error => {
                dispatch(errorCreateTournament(error))
            });

    }
}

function startUpdateTournament(tournament) {
    return {
        type: START_TOURNAMENT_UPDATE,
        status: 'start',
        tournament
    }
}

function successUpdateTournament(tournament) {
    return {
        type: SUCCESS_TOURNAMENT_UPDATE,
        status: 'success',
        tournament
    }
}

function errorUpdateTournament(error) {
    return {
        type: ERROR_TOURNAMENT_UPDATE,
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
        type: START_TOURNAMENT_DELETE,
        status: 'start',
        tournamentHash
    }
}

function successDeleteTournament(tournamentHash) {
    return {
        type: SUCCESS_TOURNAMENT_DELETE,
        status: 'success',
        tournamentHash
    }
}

function errorDeleteTournament(error) {
    return {
        type: ERROR_TOURNAMENT_DELETE,
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
        type: START_TOURNAMENT_LIST,
        status: 'start'
    }
}

function successFetchTournaments(tournaments) {
    return {
        type: SUCCESS_TOURNAMENT_LIST,
        status: 'success',
        tournaments: tournaments
    }
}

function failFetchTournaments(error) {
    return {
        type: FAIL_TOURNAMENT_LIST,
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
                .then(tournaments => tournaments.tournaments)
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
        type: START_TOURNAMENT_GET,
        status: 'start'
    }
}

function successFetchTournament(tournament) {
    return {
        type: SUCCESS_TOURNAMENT_GET,
        status: 'success',
        tournament: tournament
    }
}

function failFetchTournament(error) {
    return {
        type: FAIL_TOURNAMENT_GET,
        status: 'fail',
        error: error
    }
}

export const tournamentGet = (tournamentHash, successCallback) => {
    return function (dispatch, getState) {

        const state = getState();

        if (state.tournaments && (_.isEmpty(state.tournaments.currentTournament) || state.tournaments.currentTournament.hash !== tournamentHash)) {

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

import fetch from 'isomorphic-fetch'
import _ from 'lodash'
import { START_TOURNAMENT_LIST, SUCCESS_TOURNAMENT_LIST, FAIL_TOURNAMENT_LIST,
    START_TOURNAMENT_CREATE, SUCCESS_TOURNAMENT_CREATE, FAIL_TOURNAMENT_CREATE,
    START_TOURNAMENT_UPDATE, SUCCESS_TOURNAMENT_UPDATE, FAIL_TOURNAMENT_UPDATE,
    START_TOURNAMENT_DELETE, SUCCESS_TOURNAMENT_DELETE, FAIL_TOURNAMENT_DELETE,
    START_TOURNAMENT_GET, SUCCESS_TOURNAMENT_GET, FAIL_TOURNAMENT_GET } from '../constants'

function startTournamentCreate(tournament) {
    return {
        type: START_TOURNAMENT_CREATE,
        status: 'start',
        tournament
    }
}

function successTournamentCreate(tournament) {
    return {
        type: SUCCESS_TOURNAMENT_CREATE,
        status: 'success',
        tournament
    }
}

function failTournamentCreate(error) {
    return {
        type: FAIL_TOURNAMENT_CREATE,
        status: 'fail',
        error
    }

}

export const tournamentCreate = (tournament) => {
    return function (dispatch, getState) {

        dispatch(startTournamentCreate(tournament))

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
                dispatch(successTournamentCreate(tournament))
                if (_.isEmpty(state.tournaments.tournaments)) {
                    dispatch(tournamentList());
                }
            })
            .catch(error => {
                dispatch(failTournamentCreate(error))
            });

    }
}

function startTournamentUpdate(tournament) {
    return {
        type: START_TOURNAMENT_UPDATE,
        status: 'start',
        tournament
    }
}

function successTournamentUpdate(tournament) {
    return {
        type: SUCCESS_TOURNAMENT_UPDATE,
        status: 'success',
        tournament
    }
}

function failTournamentUpdate(error) {
    return {
        type: FAIL_TOURNAMENT_UPDATE,
        status: 'fail',
        error
    }

}

export const tournamentUpdate = (tournament) => {
    return function (dispatch, getState) {

        dispatch(startTournamentUpdate(tournament))

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
                dispatch(successTournamentUpdate(tournament))
            })
            .catch(error => {
                dispatch(failTournamentUpdate(error))
            });

    }
}

function startTournamentDelete(tournamentHash) {
    return {
        type: START_TOURNAMENT_DELETE,
        status: 'start',
        tournamentHash
    }
}

function successTournamentDelete(tournamentHash) {
    return {
        type: SUCCESS_TOURNAMENT_DELETE,
        status: 'success',
        tournamentHash
    }
}

function fileTournamentDelete(error) {
    return {
        type: FAIL_TOURNAMENT_DELETE,
        status: 'file',
        error
    }

}

export const tournamentDelete = (tournamentHash) => {
    return function (dispatch, getState) {

        dispatch(startTournamentDelete(tournamentHash))

        fetch(`/server/tournament/${tournamentHash}`, {
            method: 'DELETE'
        })
            .then(() => {
                dispatch(successTournamentDelete(tournamentHash))
            })
            .catch(error => {
                dispatch(fileTournamentDelete(error))
            });

    }
}

function startTournamentList() {
    return {
        type: START_TOURNAMENT_LIST,
        status: 'start'
    }
}

function successTournamentList(tournaments) {
    return {
        type: SUCCESS_TOURNAMENT_LIST,
        status: 'success',
        tournaments: tournaments
    }
}

function failTournamentList(error) {
    return {
        type: FAIL_TOURNAMENT_LIST,
        status: 'fail',
        error: error
    }
}

export const tournamentList = () => {
    return function (dispatch, getState) {

        const state = getState();

        if (state.tournaments && _.isEmpty(state.tournaments.tournaments)) {

            dispatch(startTournamentList())

            fetch('/server/tournament')
                .then(response => response.json())
                .then(tournaments => tournaments.tournaments)
                .then(tournaments => {
                    dispatch(successTournamentList(tournaments))
                })
                .catch(error => {
                    dispatch(failTournamentList(error))
                });
        }
    }
}

function startTournamentGet() {
    return {
        type: START_TOURNAMENT_GET,
        status: 'start'
    }
}

function successTournamentGet(tournament) {
    return {
        type: SUCCESS_TOURNAMENT_GET,
        status: 'success',
        tournament: tournament
    }
}

function failTournamentGet(error) {
    return {
        type: FAIL_TOURNAMENT_GET,
        status: 'fail',
        error: error
    }
}

export const tournamentGet = (tournamentHash) => {
    return function (dispatch, getState) {

        const state = getState();

        if (state.tournaments && (_.isEmpty(state.tournaments.currentTournament) || state.tournaments.currentTournament.hash !== tournamentHash)) {

            let currentTournament;

            if (!_.isEmpty(state.tournaments.tournaments)) {

                currentTournament = _.find(state.tournaments.tournaments, {hash: tournamentHash});

            }

            if (currentTournament) {

                dispatch(startTournamentGet(tournamentHash))
                dispatch(successTournamentGet(currentTournament));

            } else {

                dispatch(startTournamentGet(tournamentHash))

                fetch(`/server/tournament/${tournamentHash}`)
                    .then(response => response.json())
                    .then(tournament => {
                        dispatch(successTournamentGet(tournament.tournament))
                    })
                    .catch(error => {
                        dispatch(failTournamentGet(error))
                    });

            }
        }
    }
}

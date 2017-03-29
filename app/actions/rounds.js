import { START_ROUND_LAST, SUCCESS_ROUND_LAST, FAIL_ROUND_LAST } from '../constants'
import _ from 'lodash'


function startRoundLast(tournamentHash) {
    return {
        type: START_ROUND_LAST,
        status: 'start',
        tournamentHash
    }
}

function successRoundLast(tournamentHash, round) {
    return {
        type: SUCCESS_ROUND_LAST,
        status: 'success',
        round,
        tournamentHash
    }
}

function failRoundLast(error) {
    return {
        type: FAIL_ROUND_LAST,
        status: 'fail',
        error: error
    }
}

export const roundLast = (tournamentHash) => {
    return function (dispatch, getState) {

        const state = getState();

        if (state.rounds && _.isEmpty(state.rounds.last) && _.isEmpty(state.rounds.last[tournamentHash])) {

            dispatch(startRoundLast(tournamentHash))

            fetch(`/server/tournament/${tournamentHash}/tournamentRound/last`)
                .then(response => response.json())
                .then(round => round.tournamentRound)
                .then(round => {
                    dispatch(successRoundLast(tournamentHash, round))
                })
                .catch(error => {
                    dispatch(failRoundLast(error))
                });

        }
    }
}
import {
    START_TOURNAMENT_LIST, SUCCESS_TOURNAMENT_LIST, FAIL_TOURNAMENT_LIST,
    SUCCESS_TOURNAMENT_CREATE,
    SUCCESS_TOURNAMENT_UPDATE,
    SUCCESS_TOURNAMENT_DELETE,
    SUCCESS_TOURNAMENT_GET} from '../constants'
import _ from 'lodash'

const initialState = {
    tournamentListStatus: 'init',
    tournaments: [],
    currentTournament: {},
    newTournament: [] // todo: remove it
}

export default function update(state = initialState, action) {
    if (action.type === START_TOURNAMENT_LIST) {
        return Object.assign({}, state, { tournamentListStatus: action.status });
    } else if (action.type === SUCCESS_TOURNAMENT_LIST) {
        return Object.assign({}, state, { tournamentListStatus: action.status, tournaments: action.tournaments });
    } else if (action.type === FAIL_TOURNAMENT_LIST) {
        return Object.assign({}, state, { tournamentListStatus: action.status, error: action.error });
    } else if (action.type === SUCCESS_TOURNAMENT_CREATE) {
        if (!_.isEmpty(state.tournaments)) {
            return Object.assign({}, state, { tournaments: [...state.tournaments, action.tournament] });
        }
    } else if (action.type === SUCCESS_TOURNAMENT_UPDATE) {
        const tournaments = _.map(state.tournaments, (tournament) => {
            if (tournament.hash == action.tournament.hash)
                return action.tournament
            else
                return tournament
        });
        return Object.assign({}, state, { tournaments });
    } else if (action.type === SUCCESS_TOURNAMENT_DELETE) {
        if (!_.isEmpty(state.tournaments)) {
            return Object.assign({}, state, { tournaments: _.filter(state.tournaments, (tournament) => { return tournament.hash !== action.tournamentHash }) });
        }
    } else if (action.type === SUCCESS_TOURNAMENT_GET) {
        return Object.assign({}, state, { currentTournament: action.tournament });
    }
    return state
}

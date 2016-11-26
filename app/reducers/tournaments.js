import {
    READ_TOURNAMENT, UPDATE_TOURNAMENT, DELETE_TOURNAMENT,
    START_FETCH_LIST_TOURNAMENT, SUCCESS_FETCH_LIST_TOURNAMENT, FAIL_FETCH_LIST_TOURNAMENT,
    SUCCESS_CREATE_TOURNAMENT,
    SUCCESS_UPDATE_TOURNAMENT,
    SUCCESS_DELETE_TOURNAMENT,
    SUCCESS_FETCH_TOURNAMENT} from '../constants'
import _ from 'lodash'

const initialState = {
  tournamentListStatus: 'init',
  tournaments: [],
  currentTournament: {},
  newTournament: [] // todo: remove it
}

export default function update(state = initialState, action) {
  if (action.type === START_FETCH_LIST_TOURNAMENT) {
    return Object.assign({}, state, { tournamentListStatus: action.status });
  } else if (action.type === SUCCESS_FETCH_LIST_TOURNAMENT) {
    // todo: move tournaments.tournaments to actions
    return Object.assign({}, state, { tournamentListStatus: action.status, tournaments: action.tournaments.tournaments });
  } else if (action.type === FAIL_FETCH_LIST_TOURNAMENT) {
    return Object.assign({}, state, { tournamentListStatus: action.status, error: action.error });
  } else if (action.type === SUCCESS_CREATE_TOURNAMENT) {
    if (!_.isEmpty(tournaments.tournaments))
        return Object.assign({}, state, { tournaments: [...state.tournaments, action.tournament] });
  } else if (action.type === SUCCESS_UPDATE_TOURNAMENT) {
    const tournaments = _.map(state.tournaments, (tournament) => {
            if (tournament.hash == action.tournament.hash)
                return action.tournament
            else
                return tournament
        })
    return Object.assign({}, state, { tournaments });
  } else if (action.type === SUCCESS_DELETE_TOURNAMENT) {
    if (!_.isEmpty(state.tournaments))
        return Object.assign({}, state, { tournaments: _.filter(state.tournaments, (tournament) => { return tournament.hash !== action.tournamentHash }) });
  } else if (action.type === SUCCESS_FETCH_TOURNAMENT) {
    return Object.assign({}, state, { currentTournament: action.tournament });
  }
  return state
}

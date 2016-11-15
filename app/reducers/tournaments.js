import { READ_TOURNAMENT, UPDATE_TOURNAMENT, DELETE_TOURNAMENT, START_FETCH_LIST_TOURNAMENT, SUCCESS_FETCH_LIST_TOURNAMENT, FAIL_FETCH_LIST_TOURNAMENT, SUCCESS_CREATE_TOURNAMENT, SUCCESS_UPDATE_TOURNAMENT, SUCCESS_DELETE_TOURNAMENT } from '../constants'
import _ from 'lodash'

const initialState = {
  tournamentListStatus: 'init',
  tournaments: [],
  newTournament: []
}

export default function update(state = initialState, action) {
  if (action.type === START_FETCH_LIST_TOURNAMENT) {
    return { tournamentListStatus: action.status };
  }
  if (action.type === SUCCESS_FETCH_LIST_TOURNAMENT) {
    return { tournamentListStatus: action.status, tournaments: action.tournaments.tournaments };
  }
  if (action.type === FAIL_FETCH_LIST_TOURNAMENT) {
    return { tournamentListStatus: action.status, error: action.error };
  } else if(action.type === SUCCESS_CREATE_TOURNAMENT) {
    if (!_.isEmpty(tournaments.tournaments))
        return { tournaments: [...state.tournaments, action.tournament] };
  } else if(action.type === SUCCESS_UPDATE_TOURNAMENT) {
    const tournaments = _.map(state.tournaments, (tournament) => {
            if (tournament.hash == action.tournament.hash)
                return action.tournament
            else
                return tournament
        })
    return { tournaments };
  } else if(action.type === SUCCESS_DELETE_TOURNAMENT) {
    if (!_.isEmpty(state.tournaments))
        return { tournaments: _.filter(state.tournaments, (tournament) => { return tournament.hash !== action.tournamentHash }) };
  }
  return state
}

import { START_FETCH_LIST_TEAM, SUCCESS_FETCH_LIST_TEAM, FAIL_FETCH_LIST_TEAM } from '../constants'

const initialState = {
  teamListStatus: 'init',
  teams: []
}

export default function update(state = initialState, action) {
  if (action.type === START_FETCH_LIST_TEAM) {
    return { teamListStatus: action.status };
  }
  if (action.type === SUCCESS_FETCH_LIST_TEAM) {
    const teams = {};
    teams[action.tournamentHash] = action.teams.teams;
    return { teamListStatus: action.status, teams };
  }
  if (action.type === FAIL_FETCH_LIST_TEAM) {
    return { teamListStatus: action.status, error: action.error };
  }
  return state
}

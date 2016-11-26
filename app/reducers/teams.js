import _ from 'lodash'

import { START_FETCH_LIST_TEAM, SUCCESS_FETCH_LIST_TEAM, FAIL_FETCH_LIST_TEAM,
    START_CREATE_TEAM, SUCCESS_CREATE_TEAM, FAIL_CREATE_TEAM,
    SUCCESS_GET_TEAM,
    SUCCESS_UPDATE_TEAM,
    SUCCESS_DELETE_TEAM
} from '../constants'

const initialState = {
  teamListStatus: 'init',
  teams: [],
  currentTeam: {}
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
  if (action.type === SUCCESS_CREATE_TEAM) {
    if (!_.isEmpty(state.teams[action.tournamentHash])) {
        const teams = state.teams;
        teams[action.tournamentHash] = [...teams[action.tournamentHash], action.team];
        return Object.assign({}, state, { teams });
    }
  }
  if (action.type === SUCCESS_GET_TEAM) {
    return Object.assign({}, state, { currentTeam: action.team });
  }
  if (action.type === SUCCESS_UPDATE_TEAM) {
    const teams = state.teams;
    teams[action.tournamentHash] = _.map(teams[action.tournamentHash], (team) => {
        if (team.hash == action.team.hash)
            return action.team
        else
            return team
    });
    return Object.assign({}, state, { teams });
  }
  if (action.type === SUCCESS_DELETE_TEAM) {
        if (!_.isEmpty(state.teams[action.tournamentHash])) {
            const teams = state.teams;
            teams[action.tournamentHash] = _.filter(teams[action.tournamentHash], (team) => { return team.hash !== action.teamHash })
            return Object.assign({}, state, { teams });
        }
  }
  if (action.type === FAIL_CREATE_TEAM) {
    return { teamListStatus: action.status, error: action.error };
  }
  return state
}

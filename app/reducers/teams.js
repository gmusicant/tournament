import _ from 'lodash'

import { START_TEAM_LIST, SUCCESS_TEAM_LIST, FAIL_TEAM_LIST,
    SUCCESS_TEAM_CREATE, FAIL_TEAM_CREATE,
    SUCCESS_TEAM_GET,
    SUCCESS_TEAM_UPDATE,
    SUCCESS_TEAM_DELETE
} from '../constants'

const initialState = {
    teamListStatus: 'init',
    teams: [],
    currentTeam: {}
}

export default function update(state = initialState, action) {
    if (action.type === START_TEAM_LIST) {
        return Object.assign({}, state, { teamListStatus: action.status });
    } else if (action.type === SUCCESS_TEAM_LIST) {
        const teams = {};
        teams[action.tournamentHash] = action.teams.teams;
        return Object.assign({}, state, { teamListStatus: action.status, teams });
    } else if (action.type === FAIL_TEAM_LIST) {
        return Object.assign({}, state, { teamListStatus: action.status, error: action.error });
    } else if (action.type === SUCCESS_TEAM_CREATE) {
        let ret = Object.assign({}, state, { currentTeam: {} });
        if (!_.isEmpty(state.teams[action.tournamentHash])) {
            const teams = state.teams;
            teams[action.tournamentHash] = [...teams[action.tournamentHash], action.team];
            ret = Object.assign({}, ret, { teams });
        }
        return ret;
    } else if (action.type === FAIL_TEAM_CREATE) {
        return Object.assign({}, state, { teamListStatus: action.status, error: action.error });
    } else if (action.type === SUCCESS_TEAM_GET) {
        return Object.assign({}, state, { currentTeam: action.team });
    } else if (action.type === SUCCESS_TEAM_UPDATE) {
        const teams = state.teams;
        teams[action.tournamentHash] = _.map(teams[action.tournamentHash], (team) => {
            if (team.hash == action.team.hash)
                return action.team
            else
                return team
        });
        return Object.assign({}, state, { teams, currentTeam: {} });
    } else if (action.type === SUCCESS_TEAM_DELETE) {
        if (!_.isEmpty(state.teams[action.tournamentHash])) {
            const teams = state.teams;
            teams[action.tournamentHash] = _.filter(teams[action.tournamentHash], (team) => { return team.hash !== action.teamHash })
            return Object.assign({}, state, { teams, currentTeam: {}  });
        }
    }
    return state
}

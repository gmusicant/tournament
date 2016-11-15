import { SELECT_CURRENT_TOURNAMENT, SELECT_CURRENT_TOURNAMENT_HASH, LOAD_CURRENT_TOUNAMENT } from '../constants'

const initialState = {
  currentTournament: {}
}

export default function update(state = initialState, action, params) {
  if(action.type === SELECT_CURRENT_TOURNAMENT) {
    return { currentTournament: action.action.tournament };
  }
  else if(action.type === LOAD_CURRENT_TOUNAMENT) {
    // todo: load tournament by action.hash
    return { currentTournament: state.currentTournament };
  }
  return state
}

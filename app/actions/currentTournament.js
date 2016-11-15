import { SELECT_CURRENT_TOURNAMENT, LOAD_CURRENT_TOURNAMENT } from '../constants'

export function selectCurrentTournament(tournament) {
  return {
    type: SELECT_CURRENT_TOURNAMENT,
    action: {
        tournament
    }
  }
}

export function loadCurrentTournament(hash) {
  return {
    type: LOAD_CURRENT_TOURNAMENT,
    action: {
        hash
    }
  }
}

import _ from 'lodash'

import { SUCCESS_ROUND_LAST } from '../constants'

const initialState = {
    last: {}
}

export default function update(state = initialState, action) {
    if (action.type === SUCCESS_ROUND_LAST) {
        const last = state.last;
        last[action.tournamentHash] = action.round;
        return Object.assign({}, state, { last });
    }
    return state
}

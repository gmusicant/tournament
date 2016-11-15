import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'

import _ from 'lodash'

function renderLink(link, text, currentTournamentHash) {

    if (currentTournamentHash) {
        return <Link to={`/client/${currentTournamentHash}/${link}`}>{text}</Link>
    } else {
        return <span>{text}</span>
    }

}

function App({ children, currentTournamentHash }) {

  const
    linkUrl = currentTournamentHash ? `/client/${currentTournamentHash}/tournaments` : '/client';

  return (
    <div>
      <header>
        {' '}
        <Link to={ linkUrl }>TournamentList</Link>
        {' '}
        { renderLink("teams", 'Teams', currentTournamentHash) }
        {' '}
        { renderLink("games", 'Games', currentTournamentHash) }
        {' '}
        { renderLink("results", 'Results', currentTournamentHash) }
      </header>
      <div style={{ marginTop: '1.5em' }}>{children}</div>
    </div>
  )
}

export default connect(
  (state, optProps) => ({ currentTournamentHash: optProps.params.tournamentHash })

)(App)

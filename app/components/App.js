import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'

import _ from 'lodash'

function renderLink(link, text, currentTournamentHash) {

    if (currentTournamentHash) {
        return <Link to={`/client/${currentTournamentHash}/${link}`}>{text}</Link>
    } else {
        return <a href="#">{text}</a>
    }

}

function App({ children, currentTournamentHash }) {

  const
    linkUrl = currentTournamentHash ? `/client/${currentTournamentHash}/tournaments` : '/client',
    classNameForLinks = currentTournamentHash ? '' : 'disabled';

  return (
    <div className="container">
        <header>
            <ul className="nav nav-tabs">
                <li>
                    <Link to={ linkUrl }>TournamentList</Link>
                </li>
                <li className={classNameForLinks}>
                    { renderLink("teams", 'Teams', currentTournamentHash) }
                </li>
                <li className={classNameForLinks}>
                    { renderLink("games", 'Games', currentTournamentHash) }
                </li>
                <li className={classNameForLinks}>
                    { renderLink("results", 'Results', currentTournamentHash) }
                </li>
            </ul>
        </header>
    <div style={{ marginTop: '1.5em' }}>{children}</div>
</div>
  )
}

export default connect(
  (state, optProps) => ({ currentTournamentHash: optProps.params.tournamentHash })

)(App)

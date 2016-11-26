import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

function TournamentListRow( { tournament, openTournamentForm, position, tournamentDelete} ) {
  return <tr>
    <td>
    {position}
    </td>
    <td>
        {tournament.title}
    </td>
    <td>
    <button className="btn btn-info" onClick={ () => {
        return browserHistory.push(`/client/${tournament.hash}/tournaments`);
    }}>
        Select this
    </button>&nbsp;
    <button className="btn btn-warning" onClick={openTournamentForm.bind(this, tournament)}>
     Edit
    </button>
    </td>
    </tr>
}

export default connect()(TournamentListRow)


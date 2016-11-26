import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

function TeamListRow( { position, team, openTeamsForm } ) {
  return <tr>
    <td>
    {position}
    </td>
    <td>
        {team.title}
    </td>
    <td>
    <button className="btn btn-warning"  onClick={openTeamsForm.bind(this, team)}>Edit</button>&nbsp;
    </td>
    </tr>
}

export default connect()(TeamListRow)


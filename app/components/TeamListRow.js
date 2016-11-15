import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

function TeamListRow( { team } ) {
  return <div>
    { team.title }
    </div>
}

export default connect()(TeamListRow)


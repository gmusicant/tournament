import React from 'react'
import { connect } from 'react-redux'

function GameListRow( { position, teamA, teamB, fieldNumber } ) {
    return <div className="col-md-4">
            <div className="game-border-rouded">
            <div className="row sub-level">
                <div className="col-md-5">
                    {teamA.title}
                </div>
                <div className="col-md-2">
                    <div className="field-number"><div className="sub-field-number">{fieldNumber}</div></div>
                </div>
                <div className="col-md-5">
                    {teamB.title}
                </div>
            </div>
            </div>
        </div>
}

export default connect()(GameListRow)


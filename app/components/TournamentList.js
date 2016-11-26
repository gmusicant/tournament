import React, { Component} from 'react'
import _ from 'lodash'
import TournamentListRow from './TournamentListRow'

export default class TournamentList extends Component {

    render() {

        const {
            tournaments, listTournaments, createTournament, openTournamentForm
        } = this.props


        return (
            <div className="container">
                <div>
                    <button className="btn btn-warning" onClick={ openTournamentForm }>Add tournament</button>
                </div>
                <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>title</th>
                                <th>action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {_.map(tournaments, (tournament, index) => {
                                return <TournamentListRow tournament={tournament} position={index+1} key={index} openTournamentForm={openTournamentForm}  />
                            })}
                        </tbody>
                    </table>
                    <button onClick={() => listTournaments()}>listTournaments</button>
                    <button onClick={() => createTournament("test")}>Decrease</button>
                </div>
            </div>)
      }

}
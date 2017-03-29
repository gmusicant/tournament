import React, { Component } from 'react'
import _ from 'lodash'

import GameListRow from './GameListRow'

export default class GameList extends Component {

    gameFind(teams, teamHash) {
        const team = _.find(teams, {hash: teamHash});
        return !_.isEmpty(team) ? team : {};
    }

    render() {

        const { teams, games } = this.props;

        // hash
        // fieldNumber
        // gameFinished
        // teamA
        // teamB

        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-4">
                        <button className="btn btn-warning">Start new round</button>
                    </div>
                </div>
                <div className="row">
                    {_.map(games, (game, index) => {

                        if (game.game.length == 2) {

                            const teamA = this.gameFind(teams, game.game[0]);
                            const teamB = this.gameFind(teams, game.game[1]);

                            const gameFinished = !_.isEmpty(game.results);

                            if (!_.isEmpty(teamA) && !_.isEmpty(teamB)) {
                                return <GameListRow teamA={teamA} teamB={teamB} key={index} fieldNumber={index+1} gameHash={game.hash} gameFinished={gameFinished}  />
                            }

                        }

                        return '';
                    })}
                </div>
            </div>)
    }
}
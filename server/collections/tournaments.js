/*

    - list of people
    - make teams from people(supermele)
    - sort teams list
    - combine supermele (people in teams)
    - enter result to team -> track result for person
    - calculate results
    - generate next round with provided teams

    ============================
    list of current actions
    - add team
    - list teams
    - start new round
    - list groups of teams on fields
    - enter results

    ============================
    for grafical cleverty we can split tree for 2 or 4 ways.
    A -             - E
        A -     - E
    B -             - F
            A-E
    C -             - J
        C -     - K
    D -             - K

*/

var _ = require('lodash');

function swidishCalculationResults(people, calculateForGamesCountStart, calculateForGamesCountEnd) {

    if (_.isUndefined(calculateForGamesCountEnd)) {
        calculateForGamesCountStart = 0;
    }

    if (_.isUndefined(calculateForGamesCountEnd)) {
        if (people && people[0] && people[0].gamesResults && people[0].gamesResults.length)
            calculateForGamesCountEnd = people[0].gamesResults.length;
        else
            calculateForGamesCountEnd = 0;
    }

    var listPlayers = _.map(people, function(player) {

        player.points = _.sum(_.map(player.gamesResults.slice(calculateForGamesCountStart,calculateForGamesCountEnd), function(gameResult) {
            return +gameResult.points - gameResult.opponentPoints;
        }));

        player.wins = _.sum(_.map(player.gamesResults.slice(calculateForGamesCountStart,calculateForGamesCountEnd), function(gameResult) {
            return Number(gameResult.points > gameResult.opponentPoints);
        }));

        return player;
    });

    // we have to do this after all players have wins count from previous loop
    listPlayers = _.map(listPlayers, function(player) {
        player.buhgolts = _.sum(_.map(player.gamesResults.slice(calculateForGamesCountStart,calculateForGamesCountEnd), function(gameResult) {
            return _.find(listPlayers, {id: gameResult.opponent}).wins;
        }));
        return player;
    });

    return listPlayers;

}

exports = module.exports = {

    swidishCalculationResults: swidishCalculationResults

}
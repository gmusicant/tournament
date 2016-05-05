var React = require('react');
var ReactDOM = require('react-dom');

var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;

var ReactApp = require('./ReactApp.js');
var TournamentList = require('./TournamentList.js');
var TeamList = require('./TeamList.js');
var TeamAdd = require('./TeamAdd.js');
var TeamEdit = require('./TeamEdit.js');
var TournamentAdd = require('./TournamentAdd.js');
var TournamentEdit = require('./TournamentEdit.js');
var GameList = require('./GameList.js');
var GameResultAdd = require('./GameResultAdd.js');
var GameResultEdit = require('./GameResultEdit.js');
var AdminGameResultList = require('./AdminGameResultList.js');
var AdminGameRoundAdd = require('./AdminGameRoundAdd.js');
var TournamentResult = require('./TournamentResult.js');

var mountNode = document.getElementById('react-main-mount');

// console.log(ReactRoute);
// ReactDOM.render(<ReactApp/>, mountNode);
ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/">
      <Route path="client" component={ReactApp}>
        <Route path="/client/tournament/list" component={TournamentList} />
        <Route path="/client/tournament/list/:tournamentHash" component={TournamentList} />
        <Route path="/client/tournament/add" component={TournamentAdd} />
        <Route path="/client/tournament/:tournamentHash" component={TournamentEdit} />
        <Route path="/client/tournament/:tournamentHash/team/list" component={TeamList} />
        <Route path="/client/tournament/:tournamentHash/team/add" component={TeamAdd} />
        <Route path="/client/tournament/:tournamentHash/team/:teamHash" component={TeamEdit} />
        <Route path="/client/tournament/:tournamentHash/game/list" component={GameList} />
        <Route path="/client/tournament/:tournamentHash/round/:roundHash/game/result/add" component={GameResultAdd} />
        <Route path="/client/tournament/:tournamentHash/round/:roundHash/game/result/:gameResultHash" component={GameResultEdit} />
        <Route path="/client/tournament/:tournamentHash/admin/result/list" component={AdminGameResultList} />
        <Route path="/client/tournament/:tournamentHash/admin/round/add" component={AdminGameRoundAdd} />
        <Route path="/client/tournament/result/:tournamentHash" component={TournamentResult} />
      </Route>
    </Route>
  </Router>
), mountNode)
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { reducer as formReducer } from 'redux-form'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import count from './reducers/count'
import tournaments from './reducers/tournaments'
import teams from './reducers/teams'


import App from './components/App'
import Tournaments from './containars/Tournaments'
import TournamentEdit from './containars/TournamentEdit'
import Teams from './containars/Teams'
import TeamEdit from './containars/TeamEdit'
import Games from './components/Games'
import Results from './components/Results'

const reducer = combineReducers({
  count,
  tournaments,
  teams,
  routing: routerReducer,
  form: formReducer
})

const loggerMiddleware = createLogger()

const store = createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={history}>
        <Route path="/client" component={App}>
          <IndexRoute component={Tournaments}/>
          <Route path=":tournamentHash/tournaments" component={Tournaments}/>
          <Route path="tournaments/add" component={TournamentEdit}/>
          <Route path=":tournamentHash/edit" component={TournamentEdit}/>
          <Route path=":tournamentHash/teams" component={Teams}/>
          <Route path=":tournamentHash/teams/add" component={TeamEdit}/>
          <Route path=":tournamentHash/teams/:teamHash/edit" component={TeamEdit}/>
          <Route path=":tournamentHash/games" component={Games}/>
          <Route path=":tournamentHash/results" component={Results}/>
        </Route>
      </Router>
    </div>
  </Provider>,
  document.getElementById('react-main-mount')
)
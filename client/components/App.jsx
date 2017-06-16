import React from 'react'

import {Route, BrowserRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import Auth from '../auth'
import Calendar from './Calendar'
import Book from './Book'
import Callback from './Callback'
import history from '../utils/history'
import Login from './Login'
import AdminPortal from './AdminPortal'
import Registration from './Registration'
import Logout from './Logout'

import {checkLogin} from '../actions/auth'

function handleAuthentication (cb) {
  const auth = new Auth()
  // if (/access_token|id_token|error/.test(nextState.location.hash)) {
  auth.handleAuthentication(cb)
  // }
}

class App extends React.Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    handleAuthentication(this.props.checkLogin)
  }
  render () {
    return (
      <BrowserRouter history={history} component={App}>
        <div>
          {!this.props.user.fullName && <Route path="/" component={Login} />}
          {this.props.user.fullName && <Route path="/" component={Logout} />}
          <Route path="/callback" component={Callback} />
          <Link to="/calendar">Bookings</Link>
          <Link to="/admin">Admin</Link>
          <Route path='/admin' component={AdminPortal} />
          <Route path='/calendar' component={Calendar} />
          <Route path="/book" component={Book} />
          <Route path='/register' component={Registration} />
        </div>
      </BrowserRouter>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user
  }
}

function mapDispatchToProps (dispatch) {
  return {
    checkLogin: () => dispatch(checkLogin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

import React from 'react'

import {Route, BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import Auth from '../auth'
import Book from './Book'
import Callback from './Callback'
import history from '../utils/history'
import AdminPortal from './AdminPortal'
import Registration from './Registration'
import NewCalendar from './NewCalendar'
import Schedular from './Schedular'
import Navigation from './Navigation'
import Profile from './Profile'
import Details from './Details'
import DetailsProfile from './DetailsProfile'
import Home from './Home'
import Error from './Error'

import {checkLogin} from '../actions/auth'

function handleAuthentication (cb) {
  const auth = new Auth()
  // if (/access_token|id_token|error/.test(nextState.location.hash)) {
  auth.handleAuthentication(cb)
  // }
}

class App extends React.Component {

  componentDidMount () {
    handleAuthentication(this.props.checkLogin)
  }
  render () {
    return (
      <BrowserRouter history={history} component={App}>
        <div>
          <Route path='/' render={props => (
            <Navigation fullName={this.props.user.fullName} />
          )}/>
          {this.props.error && <Error /> }
          <Route exact path='/' component={Home} />
          <Route path="/callback" component={Callback} />
          <Route path='/admin' component={AdminPortal} />
          <Route path='/calendar' component={NewCalendar} />
          <Route path='/schedule' component={Schedular} />
          <Route path="/book" component={Book} />
          <Route path='/register' component={Registration} />
          <Route path='/profile' component={Profile} />
          <Route path='/details' component={Details} />
          <Route path='/detailsprofile' component={DetailsProfile} />
        </div>
      </BrowserRouter>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user,
    error: state.error
  }
}

function mapDispatchToProps (dispatch) {
  return {
    checkLogin: () => dispatch(checkLogin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

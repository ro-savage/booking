import React from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import {submitRegistration} from '../actions/auth'

class Registration extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fullName: '',
      phoneNumber: '',
      emailAddress: '',
      authId: props.authId
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange (e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleSubmit () {
    const registrationInfo = {
      fullName: this.state.fullName.trim(),
      phoneNumber: this.state.phoneNumber.trim(),
      emailAddress: this.state.emailAddress.trim(),
      authId: this.state.authId,
      admin: false
    }
    this.props.submitRegistration(registrationInfo)
  }
  render () {
    return (
      <div className='login-page'>
        <div>
          <h2>Please Enter Your Details</h2>
          <p><input className='form-control' name='fullName' onChange={this.handleChange} placeholder='Full Name' /></p>
          <p><input className='form-control' name='emailAddress' onChange={this.handleChange} placeholder='Contact Email Address' /></p>
          <p><input className='form-control' name='phoneNumber' onChange={this.handleChange} placeholder='Contact Phone Number' /></p>
          <p><button className='btn btn-primary' onClick={this.handleSubmit}>Register</button></p>
        </div>
        {this.props.redirectTo === 'calendar' && <Redirect to='/calendar' />}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    redirectTo: state.redirectTo
  }
}

function mapDispatchToProps (dispatch) {
  return {
    submitRegistration: registrationInfo => dispatch(submitRegistration(registrationInfo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration)
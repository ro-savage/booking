import React from 'react'
import {connect} from 'react-redux'
import {ModalContainer, ModalDialog} from 'react-modal-dialog'

class  Error extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: true
    }
  }
  handleClose () {
    this.setState({
      modal: false
    })
  }
  render () {
    return (
      <div>
        {this.props.errorMessage && this.state.modal &&
        <ModalContainer onClose={this.handleClose}>
            <ModalDialog onClose={this.handleClose}>
              <h1>{this.props.errorMessage}</h1>
            </ModalDialog>
        </ModalContainer>
      }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    errorMessage: state.error
  }
}

export default connect(mapStateToProps)(Error)

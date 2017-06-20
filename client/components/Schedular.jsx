import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'

import {makeNewBooking} from '../actions/calendar'
import {compareSlotSelection, takenTimesIntoIntervals, intervals} from '../utils/overlap'

class Schedular extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: null,
      startTime: null,
      endTime: null,
      mouseDown: false
    }
    this.mousePressed = this.mousePressed.bind(this)
    this.mouseReleased = this.mouseReleased.bind(this)
    this.mouseEnter = this.mouseEnter.bind(this)
    this.submitBooking = this.submitBooking.bind(this)
  }
  submitBooking () {
    const chosenSlots = intervals(this.state.startTime, this.state.endTime)
    const takenSlots = takenTimesIntoIntervals(this.props.bookings)
    if ((compareSlotSelection(chosenSlots, takenSlots))) {
      return alert('That time has already been taken!')
    }

    this.props.makeNewBooking(this.state.startTime, this.state.endTime)
    this.props.history.push('/book')
  }

  mousePressed (e) {
    const dateString = e.target.id.substr(4)
    const startTime = moment(dateString, 'YYYY-MM-DD-HH-mm')
    this.setState({
      selectedTime: startTime,
      startTime,
      endTime: moment(startTime).add(30, 'minutes'),
      mouseDown: true
    })
  }

  mouseReleased (e) {
    this.setState({
      mouseDown: false
    })
  }

  mouseEnter (e) {
    if (this.state.mouseDown) {
      const dateString = e.target.id.substr(4)
      const endTime = moment(dateString, 'YYYY-MM-DD-HH-mm')
      if (endTime > this.state.selectedTime) {
        this.setState({
          startTime: this.state.selectedTime,
          endTime: moment(endTime).add(30, 'minutes')
        })
      }
      if (endTime < this.state.selectedTime) {
        this.setState({
          startTime: endTime,
          endTime: moment(this.state.selectedTime).add(30, 'minutes')
        })
      }
    }
  }

  render () {
    return (
      <div className='schedule'>
        <div className='new-booking-form'>
          <p>Date: <input value={moment(this.state.startTime).format('DD/MM/YYYY')} /></p>
          <p>Start Time: <input value={moment(this.state.startTime).format('HH:mm')} /></p>
          <p>End Time: <input value={moment(this.state.endTime).format('HH:mm')} /></p>
          <p><input type='submit' onClick={this.submitBooking} value='Book Now' /></p>
        </div>
        <div className='container'>
          <h3>Key:</h3>
          <div className='row'>
            <div className='col-md-1'>Availible<div className='availible' /></div>
            <div className='col-md-1'>Reserved<div className='reserved-key' /></div>
            <div className='col-md-1'>Booked<div className='booked-key' /></div>
          </div>
        </div>
        <div className='schedule-navbar'/>
        <div className='row'>
          <div className='col-md-1'>
          <img src='./images/left.png' height="70"/>
          </div>
          <div className='col-md-10'>
            </div>
          <div className='col-md-1'>
          <img src='./images/right-arrow-icon.png' height="70"/>
        </div>
        </div>
        <div className="schedule-body">
          <div className='schedule-header-container'>
            <div className='schedule-header time'>Timeslot</div>
            <div className='schedule-header'>{moment(this.props.date).subtract(1, 'days').format('DD MMMM YYYY')}</div>
            <div className='schedule-header'>{moment(this.props.date).format('DD MMMM YYYY')}</div>
            <div className='schedule-header'>{moment(this.props.date).add(1, 'days').format('DD MMMM YYYY')}</div>
          </div>
          <div className='schedule-columns-container'>
            <div className='schedule-hours-container'>
              {this.getHours()}
            </div>
            <div className='schedule-column-container yesterday'>
              {this.getTimeSlots(moment(this.props.date).subtract(1, 'days'))}
            </div>
            <div className='schedule-column-container today'>
              {this.getTimeSlots(moment(this.props.date))}
            </div>
            <div className='schedule-column-container tomorrow'>
              {this.getTimeSlots(moment(this.props.date).add(1, 'days'))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  getHours () {
    const d = moment()
    const hourArray = []
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 2; j++) {
        let selectedDate = d.set({'hours': i + 6, 'minutes': j + 30})
        let dateFormatted = moment(selectedDate).format('HH:mm')
        let divContents = ''
        let classNames = 'hour'
        if (j === 1) {
          classNames += ' half-hour'
        } else {
          classNames += ' full-hour'
          divContents = dateFormatted
        }
        hourArray.push(<div key={dateFormatted} className={classNames}>{divContents}</div>)
      }
    }
    return hourArray
  }

  getTimeSlots (d) {
    const dayArray = []
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 2; j++) {
        let selectedDate = d.set({'hours': i + 6, 'minutes': j + 30})
        let classNames = 'slot'
        let ptag = ''
        if (j === 1) {
          classNames += ' half-hour'
        } else {
          classNames += ' full-hour'
        }
        const dateFormatted = moment(selectedDate).format('YYYY-MM-DD-HH-mm')
        if (selectedDate >= this.state.startTime && selectedDate < this.state.endTime) {
          classNames += ' selected'
        }
        if (this.props.bookings.find(booking => {
          return booking.startDate <= selectedDate && booking.endDate > selectedDate && booking.confirmed === false
        })) {
          classNames += ' reserved'
        }
        if (this.props.bookings.find(booking => {
          console.log(moment(booking.startDate))
          return booking.startDate <= selectedDate && booking.endDate > selectedDate && booking.confirmed === true
        })) {
          classNames += ' confirmed'
        }
        const toDisplay = this.props.bookings.find(booking => {
          return booking.startDate === selectedDate
        })
        if (toDisplay && toDisplay.fullName) {
          ptag = toDisplay.fullName + ' ' + toDisplay.purpose
        }
        dayArray.push(<div key={dateFormatted} id={'slot' + dateFormatted} className={classNames} onMouseDown={this.mousePressed} onMouseUp={this.mouseReleased} onMouseOver={this.mouseEnter}>{ <div>{ptag}</div>}</div>)
      }
    }
    return dayArray
  }
}

function mapStateToProps (state) {
  return {
    date: state.display.date,
    bookings: state.bookings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    makeNewBooking: (dateStart, dateEnd) => dispatch(makeNewBooking(dateStart, dateEnd))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedular)

import {login} from '../api'

export const BOOKINGPOSTED = 'BOOKINGPOSTED'
export const RECEIVE_BOOKINGS = 'RECEIVE_BOOKINGS'
export const UNCONFIRMED = 'UNCONFIRMED'
export const WAITING = 'WAITING'
export const NOT_WAITING = 'NOT_WAITING'
export const ADMINSUCCESS = 'ADMINSUCCESS'
export const ERROR = 'ERROR'
export const EMAIL_CHANGED = 'EMAIL_CHANGED'

export function newBooking (data) {
  return dispatch => {
    dispatch(gettingData())
    login('post', '/user/addbooking', data)
      .then(res => {
        if (res.body.error) return dispatch(errorHandler(res.body.error))
        dispatch(bookingPosted(res.body.booking))
        dispatch(receiveBookings(res.body.bookings))
        dispatch(receivedData())
        sendEmail(res.body.booking)
      })
  }
}

function sendEmail (data) {
  return dispatch => {
    login('post', '/sendemail', data)
    .then(f => f)
  }
}

function sendConfirm (data) {
  return dispatch => {
    login('post', '/sendconfirm/', data)
    .then(f => f)
  }
}

function bookingPosted (booking) {
  return {
    type: BOOKINGPOSTED,
    booking
  }
}

export const receiveBookings = bookings => {
  return {
    type: RECEIVE_BOOKINGS,
    bookings
  }
}

export function errorHandler (error) {
  return {
    type: ERROR,
    error
  }
}

export const gettingData = () => {
  return {
    type: WAITING
  }
}

export const receivedData = () => {
  return {
    type: NOT_WAITING
  }
}

export function confirm (id) {
  return dispatch => {
    dispatch(gettingData())
    login('put', `/admin/confirm/${id}`)
    .then(res => {
      dispatch(receivedData())
      if (res.body.result) {
        res.body.bookings.find(item => {
          if (item._id === id) {
            dispatch(sendConfirm(item))
          }
          dispatch(receiveBookings(res.body.bookings))
        })
      }
    })
  }
}

export function deleteBooking (id) {
  return dispatch => {
    dispatch(gettingData())
    login('delete', `/admin/delete/${id}`)
    .then(res => {
      if (res.body.result) {
        dispatch(receivedData())
        return dispatch(receiveBookings(res.body.bookings))
      }
    })
  }
}

export function makeAdmin (email) {
  return dispatch => {
    dispatch(gettingData())
    login('put', `/admin/makeadmin/${email}`)
    .then(res => {
      dispatch(adminSuccess(res))
    })
  }
}

function adminSuccess (res) {
  return {
    type: ADMINSUCCESS,
    res
  }
}

export function selectBooking (booking) {
  return {
    type: BOOKINGPOSTED,
    booking
  }
}

export function requestDelete (id) {
  return dispatch => {
    dispatch(gettingData())
    login('put', `/user/requestdelete/${id}`)
    .then(res => {
      if (res.body.result) {
        dispatch(receivedData())
        return dispatch(receiveBookings(res.body.bookings))
      }
    })
  }
}

export function emailAlertChange (email) {
  return dispatch => {
    dispatch(gettingData())
    console.log(email)
    login('put', '/admin/notificationemail', email)
    .then(res => {
      dispatch(receivedData())
      return dispatch(emailChanged(res))
    })
  }
}

function emailChanged (data) {
  return {
    type: EMAIL_CHANGED,
    data
  }
}

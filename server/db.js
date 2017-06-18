const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient

function anonGetAllBookings (cb) {
  getAllBookings((err, bookings) => {
    bookings = bookings.map(filterOutDetails)
    cb(err, bookings)
  })
}

function userGetAllBookings (authId, cb) {
  getAllBookings((err, bookings) => {
    if (err) return cb(err)
    checkAdminStatus(authId, (err, admin) => {
      if (err) return cb(err)
      if (admin) return cb(null, bookings)
      bookings = bookings.map(booking => {
        if (booking.authId === authId) {
          return booking
        }
        return filterOutDetails(booking)
      })
      cb(null, bookings)
    })
  })
}

function getAllBookings (cb) {
  return getDatabase((err, db) => {
    if (err) return cb(err)
    return db.collection('bookings').find().toArray((err, bookings) => {
      if (err) return cb(err)
      cb(null, bookings)
    })
  })
}

function filterOutDetails (booking) {
  return {
    startDate: booking.startDate,
    endDate: booking.endDate,
    confirmed: booking.confirmed
  }
}

function checkAdminStatus (authId, cb) {
  getUserDetails(authId, (err, user) => {
    if (err) return cb(err)
    cb(null, user.admin)
  })
}

function userAddBooking (booking, authId, cb) {
  getDatabase((err, db) => {
    if (err) return cb(err)
    db.collection('bookings').save(booking, (err, result) => {
      if (err) return cb(err)
      userGetAllBookings(authId, (err, bookings) => {
        if (err) return cb(err)
        cb(null, {booking, bookings})
      })
    })
  })
}

function confirmBooking (req, authId, cb) {
  getDatabase((err, db) => {
    if (err) return cb(err)
    db.collection('bookings').update({_id: ObjectId(req.params.id)}, {$set: {'confirmed': true}}, (err, result) => {
      if (err) return cb(err)
      userGetAllBookings(authId, (err, bookings) => {
        if (err) return cb(err)
        cb(null, {result, bookings})
      })
    })
  })
}

function addUser (user, cb) {
  getDatabase((err, db) => {
    if (err) return cb(err)
    db.collection('users').save(user, (err, result) => {
      if (err) return cb(err)
      cb(null, result.ops[0])
    })
  })
}

function getUsers (id, cb) {
  getDatabase((err, db) => {
    if (err) return cb(err)
    db.collection('users').find().toArray((err, results) => {
      if (err) return cb(err)
      cb(null, results)
    })
  })
}

function getDatabase (cb) {
  MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
    if (err) return cb(err)
    const db = database.db('admin') // To be changed before deployment to a database for production
    db.authenticate(process.env.DB_USER, process.env.DB_PW, (err, result) => {
      cb(err, db)
    })
  })
}

function getUserDetails (authId, cb) {
  getDatabase((err, db) => {
    if (err) return cb(err)
    db.collection('users').find().toArray((err, results) => {
      if (err) return cb(err)
      const userDetails = results.find(user => user.authId === authId)
      return cb(null, userDetails)
    })
  })
}

function deleteBooking (id, authId, cb) {
  getDatabase((err, db) => {
    if (err) return cb(err)
    db.collection('bookings').remove({_id: ObjectId(id)}, (err, result) => {
      if (err) return cb(err)
      userGetAllBookings(authId, (err, bookings) => {
        if (err) return cb(err)
        cb(null, {result, bookings})
      })
    })
  })
}

function makeUserAdmin (email, cb) {
  getDatabase((err, db) => {
    if (err) return cb(err)
    db.collection('users').update({emailAddress: email}, {$set: {'admin': true}}, (err, result) => {
      if (err) return cb(err)
      return cb(null, result)
    })
  })
}

function validate (obj) {
  Object.values.map(item => {
    if (item) {
      return true
    } else {
      return false
    }
  })
}

module.exports = {
  anonGetAllBookings,
  userGetAllBookings,
  userAddBooking,
  confirmBooking,
  addUser,
  getUsers,
  getUserDetails,
  deleteBooking,
  makeUserAdmin
}
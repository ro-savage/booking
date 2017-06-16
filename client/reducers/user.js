const initialState = {
  fullName: null,
  email: null,
  phoneNumber: null
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGGED_IN':
      return action.user
    default:
      return state
  }
}

export default user

import React from 'react'
import Auth from '../auth'

function LoginButton (props) {
  const auth = new Auth()
  return (
      <li>
        <a style={{cursor: 'pointer'}} onClick={auth.login}>
          Log In
        </a>
      </li>
  )
}

export default LoginButton
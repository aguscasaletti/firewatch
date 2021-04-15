/* eslint-disable react/no-unused-state */

import React, { useContext } from 'react'
import PropTypes, { node } from 'prop-types'

import { Redirect } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'

const AuthContext = React.createContext()

class AuthProvider extends React.PureComponent {
  static propTypes = {
    children: node.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      user: null,
      finishedAuthCheck: false,
    }
  }

  componentDidMount() {
    const localUser = localStorage.getItem('user')
    this.setState({
      user: localUser && JSON.parse(localUser),
      finishedAuthCheck: true,
    })
  }

  setUser = (user) => {
    this.setState({
      user,
    })
  }

  logout = () => {
    localStorage.removeItem('user')
    this.setState({
      user: null,
    })
  }

  login = (email, password) => {
    const user = {
      id: 123,
      email,
      password,
    }
    localStorage.setItem('user', JSON.stringify(user))
    this.setState({
      user,
    })
  }

  render() {
    const { children } = this.props

    return (
      <AuthContext.Provider
        value={{
          ...this.state,
          setUser: this.setUser,
          logout: this.logout,
          login: this.login,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }
}

const withAuthContext = (Comp) => (props) => (
  <AuthContext.Consumer>
    {(newProps) => <Comp {...props} {...newProps} />}
  </AuthContext.Consumer>
)

const { Consumer } = AuthContext

const useAuth = () => {
  const authContext = useContext(AuthContext)

  return authContext
}

class PrivateScreen extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children } = this.props
    return (
      <Consumer>
        {({ user, finishedAuthCheck }) => {
          if (!finishedAuthCheck) {
            return <CircularProgress />
          }

          return user ? children : <Redirect to="/login" />
        }}
      </Consumer>
    )
  }
}

/* HOC to make Private Screens using Context Consumer */
function makePrivate(Comp) {
  const privateScreen = (props) => (
    <PrivateScreen>{<Comp {...props} />}</PrivateScreen>
  )
  return privateScreen
}

export {
  AuthProvider,
  Consumer as AuthConsumer,
  withAuthContext,
  useAuth,
  makePrivate,
}

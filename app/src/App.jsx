import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import Home from './pages/home'
import AuthPage from './pages/auth'
import theme from './theme'

import { LayoutProvider } from './context/LayoutContext'
import { DialogProvider } from './context/DialogContext'
import { SnackbarProvider } from './context/SnackbarContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  const Providers = [
    (props) => <ThemeProvider {...props} theme={theme} />,
    SnackbarProvider,
    LayoutProvider,
    DialogProvider,
    AuthProvider,
  ].reduceRight((Cmp, Prov) => {
    if (!Cmp) return (props) => <Prov {...props} />

    return (props) => (
      <Prov>
        <Cmp {...props} />
      </Prov>
    )
  })

  return (
    <div className="App">
      <Router>
        <Providers>
          <Switch>
            <Route exact path="/login" component={AuthPage} />
            <Route exact path="/home" component={Home} />
            <Route component={() => <Redirect to="/home" />} />
          </Switch>
        </Providers>
      </Router>
    </div>
  )
}

export default App

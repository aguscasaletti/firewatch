import React, { Suspense, lazy } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import FullScreenLoading from 'components/FullScreenLoading'
import ErrorScreen from 'components/ErrorScreen/ErrorScreen'
import { UserContextProvider } from 'context/userContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const themeConfig: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({ config: themeConfig })

const twentyFourHoursInMs = 1000 * 60 * 60 * 24
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: twentyFourHoursInMs,
    },
  },
})
const Home = lazy(() => import('pages/home/Home'))

class App extends React.PureComponent {
  state = {
    error: '',
  }

  static getDerivedStateFromError(err: Error) {
    return {
      error: err.toString(),
    }
  }

  componentDidCatch(err: Error) {
    console.log('catch error', err)
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            <ChakraProvider theme={theme}>
                  {this.state.error ? (
                    <ErrorScreen message={this.state.error} />
                  ) : (
                    <Router>
                      <Suspense fallback={<FullScreenLoading />}>
                        <Switch>
                          <Route path="/home" component={Home} />
                          <Route exact path="/">
                            <Redirect to="/home" />
                          </Route>
                          <Route path="*">
                            <h1>Not found</h1>
                          </Route>
                        </Switch>
                      </Suspense>
                    </Router>
                  )}
            </ChakraProvider>
          </UserContextProvider>
        </QueryClientProvider>
      </div>
    )
  }
}

export default App

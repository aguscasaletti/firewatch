import React, { Suspense, useContext, lazy } from 'react'
import {
  Route,
  Redirect,
  Switch,
  useRouteMatch,
  BrowserRouterProps,
} from 'react-router-dom'
import Sidenav from 'components/Sidenav/Sidenav'
import UserContext from 'context/userContext'
import FullScreenLoading from 'components/FullScreenLoading'
import ErrorScreen from 'components/ErrorScreen/ErrorScreen'
import { CameraContextProvider } from 'context/cameraContext'
import { AlertsContextProvider } from 'context/alertsContext'
import flatten from 'lodash/flatten'
import { Box, Flex } from '@chakra-ui/layout'

const authorizedRoutes = [
  {
    label: 'Monitoreo',
    routes: [
      '/home/cameras',
      '/home/alerts/:id/details',
      '/home/alerts/:id/notifications',
    ],
  },
  {
    label: 'Administración',
    routes: ['/home/stations', '/home/alerts', '/home/users'],
  },
]

const Cameras = lazy(() => import('pages/cameras/Cameras'))
const AlertDetails = lazy(() => import('pages/alert-details/AlertDetails'))
const AlertNotifications = lazy(
  () => import('pages/alert-notifications/AlertNotifications'),
)

const componentsByRoute: Record<string, React.FC<BrowserRouterProps>> = {
  '/home/cameras': Cameras,
  '/home/alerts/:id/details': AlertDetails,
  '/home/alerts/:id/notifications': AlertNotifications,
}

export const getRouteElement = (route: string): React.ReactElement => {
  const Cmp: React.FC = componentsByRoute[route]

  return <Route key={route} exact path={route} component={Cmp} />
}

export const getDefaultRoute = (routes: string[]): string => {
  return routes[0]
}

const Home: React.FC = () => {
  const { path } = useRouteMatch()
  const { userInfo, logout } = useContext(UserContext)

  const routes = authorizedRoutes
    ? flatten(authorizedRoutes.map(({ routes }) => routes))
    : []

  return (
    <AlertsContextProvider>
      <CameraContextProvider>
        <Flex height="100%">
          <Sidenav
            logout={logout}
            authorizedRoutes={authorizedRoutes || []}
            userInfo={userInfo}
          />
          <Box backgroundColor="#1d2d3f" flex={1} overflow="auto">
            <Suspense fallback={<FullScreenLoading />}>
              <Switch>
                {routes.map((r) => getRouteElement(r))}
                <Route exact path={path}>
                  <Redirect to={getDefaultRoute(routes)} />
                </Route>
              </Switch>
            </Suspense>
          </Box>
        </Flex>
      </CameraContextProvider>
    </AlertsContextProvider>
  )
}

export default Home

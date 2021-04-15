import React, { memo } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'

import TopBar from 'components/TopBar'
import SideDrawer from 'components/SideDrawer'
import { makePrivate } from 'context/AuthContext'
import Map from './subpages/map/Map'

const useStyles = makeStyles((theme) => ({
  contentWrapper: {
    paddingLeft: 265,
    marginTop: 64,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 0,
    },
  },
  contentGrid: {
    padding: 24,
  },
  progressWrapper: {
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

const Home = () => {
  const classes = useStyles()
  return (
    <div>
      <CssBaseline />
      <TopBar />
      <SideDrawer />
      <Box className={classes.contentWrapper}>
        {/* {!finishedAuthCheck || !agendaPaciente ? (
          <ProgressWrapper>
            <CircularProgress />
          </ProgressWrapper>
        ) : ( */}
        <Map />
        {/* <Grid className={classes.contentGrid} container spacing={3}></Grid> */}
        {/* )} */}
      </Box>
    </div>
  )
}

export default memo(makePrivate(Home))

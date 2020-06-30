import React, { memo } from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Hidden from '@material-ui/core/Hidden'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import HomeWorkIcon from '@material-ui/icons/HomeWork'
import WhatshotIcon from '@material-ui/icons/Whatshot'
import MapIcon from '@material-ui/icons/Map'
import ExitIcon from '@material-ui/icons/ExitToApp'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import logo from 'images/fire.png'

import { useLayoutContext } from 'context/LayoutContext'
import { useAuth } from 'context/AuthContext'

const drawerWidth = 265

const useStyles = makeStyles((theme) => {
  return {
    drawerPaper: {
      width: drawerWidth,
      paddingTop: 12,
      backgroundColor: theme.palette.primary.panel,
    },
    listItemText: {
      color: 'rgba(255,255,255,.7)',
    },
    listIcon: {
      color: 'rgba(255,255,255,.7)',
    },
    logo: {
      // filter: 'brightness(0) invert(1)',
      width: 30,
      marginBottom: 32,
      marginLeft: 24,
      marginRight: 12,
    },
    logoWrapper: {
      display: 'flex',
    },
  }
})

const SideDrawer = () => {
  const classes = useStyles()
  const { mobileDrawerOpen, setMobileDrawerOpen } = useLayoutContext()
  const { logout } = useAuth()

  const renderDrawerContent = () => {
    return (
      <List>
        <div className={classes.logoWrapper}>
          <img src={logo} alt="firewatch" className={classes.logo} />
          <Typography variant="h5">Firewatch</Typography>
        </div>
        <ListItem
          onClick={() => {
            // window.open(returnURL)
          }}
          button
          key="home-link"
        >
          <ListItemIcon className={classes.listIcon}>
            <MapIcon />
          </ListItemIcon>
          <ListItemText className={classes.listItemText} primary="Inicio" />
        </ListItem>
        <ListItem
          onClick={() => {
            // window.open(returnURL)
          }}
          button
          key="regions-link"
        >
          <ListItemIcon className={classes.listIcon}>
            <WhatshotIcon />
          </ListItemIcon>
          <ListItemText className={classes.listItemText} primary="Regiones" />
        </ListItem>
        <ListItem
          onClick={() => {
            // window.open(returnURL)
          }}
          button
          key="stations-link"
        >
          <ListItemIcon className={classes.listIcon}>
            <HomeWorkIcon />
          </ListItemIcon>
          <ListItemText className={classes.listItemText} primary="Cuarteles" />
        </ListItem>
        <ListItem onClick={logout} button key="logout-link">
          <ListItemIcon className={classes.listIcon}>
            <ExitIcon />
          </ListItemIcon>
          <ListItemText className={classes.listItemText} primary="Salir" />
        </ListItem>
      </List>
    )
  }

  return (
    <nav aria-label="Mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          PaperProps={{
            className: classes.drawerPaper,
          }}
        >
          {renderDrawerContent()}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          PaperProps={{
            className: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {renderDrawerContent()}
        </Drawer>
      </Hidden>
    </nav>
  )
}

export default memo(SideDrawer)

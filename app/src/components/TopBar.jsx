import React, { useState, memo } from 'react'

import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
import { makeStyles } from '@material-ui/core/styles'

import { useAuth } from 'context/AuthContext'
import { useLayoutContext } from 'context/LayoutContext'

const drawerWidth = 265

const useStyles = makeStyles((theme) => ({
  appBar: {
    width: `calc(100vw - ${drawerWidth}px)`,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  account: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
  },
}))

const TopBar = () => {
  const { toggleMobileDrawerOpen } = useLayoutContext()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const classes = useStyles()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <AppBar className={classes.appBar} position="fixed">
      <Toolbar className={classes.toolbar}>
        <Hidden smUp>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={toggleMobileDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <div className={classes.account}>
          <Hidden xsDown implementation="css">
            <Typography
              onClick={handleMenu}
              style={{ cursor: 'pointer' }}
              variant="subtitle1"
              color="inherit"
            >
              {user.email}
            </Typography>
          </Hidden>
          <div>
            <IconButton
              aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
            </Menu>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default memo(TopBar)

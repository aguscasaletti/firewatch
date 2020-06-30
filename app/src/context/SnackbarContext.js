/* eslint-disable react/no-unused-state */

import React, { useState, useContext } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

const SnackbarContext = React.createContext()

const SnackbarProvider = ({ children }) => {
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarType, setSnackbarType] = useState('success')
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const handleClose = () => {
    setShowSnackbar(false)
  }

  const showSuccessMsg = (message) => {
    setSnackbarType('success')
    setSnackbarMessage(message)
    setShowSnackbar(true)
  }
  const showErrorMsg = (message) => {
    setSnackbarType('error')
    setSnackbarMessage(message)
    setShowSnackbar(true)
  }

  const showInfoMsg = (message) => {
    setSnackbarType('info')
    setSnackbarMessage(message)
    setShowSnackbar(true)
  }

  return (
    <SnackbarContext.Provider
      value={{
        showSuccessMsg,
        showErrorMsg,
        showInfoMsg,
      }}
    >
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <MuiAlert
          elevation={6}
          variant={snackbarType !== 'info' ? 'filled' : undefined}
          onClose={handleClose}
          severity={snackbarType}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  )
}

const { Consumer } = SnackbarContext

const useSnackbar = () => {
  const { showErrorMsg, showSuccessMsg, showInfoMsg } = useContext(
    SnackbarContext,
  )

  return {
    showErrorMsg,
    showSuccessMsg,
    showInfoMsg,
  }
}

export { SnackbarProvider, Consumer as SnackbarConsumer, useSnackbar }

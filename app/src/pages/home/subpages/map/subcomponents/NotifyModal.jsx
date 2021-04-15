import React, { memo } from 'react'

import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import MailOutlineIcon from '@material-ui/icons/MailOutline'

const useStyles = makeStyles(() => ({
  paper: {
    width: 400,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 48,
    padding: 24,
  },
  body: {
    marginTop: 12,
    marginBottom: 24,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  discard: {
    color: 'white',
    margin: 0,
  },
}))

const FireModal = ({ open, setOpen }) => {
  const classes = useStyles()

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      disableEnforceFocus
      disableAutoFocus
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
        },
      }}
    >
      <Paper className={classes.paper}>
        <Typography variant="h5">Notificar al cuartel</Typography>
        <Typography className={classes.body} variant="body1">
          ¿Deseas enviar notificaciones automáticas al cuartel más cercano al
          incidente?
        </Typography>

        <div className={classes.actions}>
          <Button
            color="secondary"
            onClick={() => {
              setOpen(false)
            }}
            className={classes.discard}
          >
            Cancelar
          </Button>
          <Button
            startIcon={<MailOutlineIcon />}
            color="secondary"
            variant="contained"
            onClick={() => {
              setOpen(false)
            }}
            style={{ margin: 0 }}
          >
            Notificar
          </Button>
        </div>
      </Paper>
    </Modal>
  )
}

export default memo(FireModal)

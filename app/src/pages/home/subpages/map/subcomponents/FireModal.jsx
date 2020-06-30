import React, { useState, memo } from 'react'

import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import video from 'images/forest-fire.mp4'

const useStyles = makeStyles(() => ({
  paper: {
    width: 400,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 48,
    padding: 24,
  },
  alertBody: {
    marginTop: 12,
    marginBottom: 24,
  },
  alertReviewButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    display: 'flex',
  },
  video: {
    width: '100%',
  },
  videoActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  discard: {
    color: 'white',
    margin: 0,
  },
}))

const FireModal = ({ open, setOpen, onConfirm }) => {
  const classes = useStyles()
  const [showVideo, setShowVideo] = useState(false)

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
        <Typography variant="h5">¡Alerta de incendio!</Typography>
        <Typography className={classes.alertBody} variant="body1">
          Se detectó un incendio forestal desde la cámara ubicada en "Cerro
          Catedral"
        </Typography>

        {showVideo ? (
          <>
            <video className={classes.video} loop autoPlay muted>
              <source src={video} type="video/mp4" />
              Tu navegador no soporta videos
            </video>
            <div className={classes.videoActions}>
              <Button
                color="secondary"
                onClick={() => {
                  setOpen(false)
                  setShowVideo(false)
                }}
                className={classes.discard}
              >
                Descartar
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={onConfirm}
                style={{ margin: 0 }}
              >
                Confirmar incendio
              </Button>
            </div>
          </>
        ) : (
          <Button
            className={classes.alertReviewButton}
            color="secondary"
            variant="contained"
            onClick={() => setShowVideo(true)}
          >
            Revisar cámara
          </Button>
        )}
      </Paper>
    </Modal>
  )
}

export default memo(FireModal)

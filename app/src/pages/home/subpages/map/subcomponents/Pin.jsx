import React from 'react'
import RoomIcon from '@material-ui/icons/Room'
import station from 'images/station.png'
import camera from 'images/camera.png'

const baseStyles = {
  transform: 'translateZ(0) translate(-50%, -50%)',
  width: 35,
}

const Pin = ({ type, ...rest }) => {
  const pinsByType = {
    station: <img style={{ ...baseStyles }} src={station} {...rest} />,
    camera: <img style={{ ...baseStyles }} src={camera} {...rest} />,
  }

  return pinsByType[type]
}

export default Pin

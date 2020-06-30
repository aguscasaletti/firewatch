/* global google  */
import React, { memo, useEffect, useState } from 'react'
// import GoogleMapReact from 'google-map-react'
import { makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'context/SnackbarContext'

import station from 'images/station.png'
import camera from 'images/camera.png'
import cameraRed from 'images/camera_red.png'

import FireModal from './subcomponents/FireModal'
import NotifyModal from './subcomponents/NotifyModal'

const STATION_ICON_SCALE = 40
const CAMERA_ICON_SCALE = 60

const stations = [
  {
    name: 'Bomberos Voluntarios Ruca Cura',
    pos: {
      lat: -41.1150231,
      lng: -71.4443278,
    },
  },
  {
    name: 'Bomberos Voluntarios Melipal - Destacamento Cohiues',
    pos: {
      lat: -41.1543109,
      lng: -71.4152098,
    },
  },
  {
    name: 'Destacamento 1 Bomberos Voluntarios Bariloche',
    pos: {
      lat: -41.1713052,
      lng: -71.3368034,
    },
  },
]

const cameras = [
  {
    name: 'Cámara Cerro Catedral',
    pos: {
      lat: -41.1833051,
      lng: -71.4400141,
    },
  },
  {
    name: 'Cámara Cerro Navidad',
    pos: {
      lat: -41.166637,
      lng: -71.5851116,
    },
  },
  {
    name: 'Cámara Cerro Capilla',
    pos: {
      lat: -41.0594531,
      lng: -71.6353655,
    },
  },
  {
    name: 'Cámara Cerro Goye',
    pos: {
      lat: -41.1183855,
      lng: -71.5041733,
    },
  },
]

const defaults = {
  center: {
    lat: -41.1283316,
    lng: -71.4099546,
  },
  zoom: 12,
}

let map, cameraMarkers, stationMarkers

const Map = () => {
  const [showModal, setShowModal] = useState(false)
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const { showErrorMsg } = useSnackbar()

  function calculateRoute(map) {
    var directionsService = new google.maps.DirectionsService()
    var directionsRenderer = new google.maps.DirectionsRenderer()
    directionsRenderer.setMap(map)

    var request = {
      origin: stations[1].pos,
      destination: cameras[0].pos,
      travelMode: 'WALKING',
    }
    directionsService.route(request, function (result, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result)
        stationMarkers[1].setLabel('Cuartel más cercano: 2,5 km')
        cameraMarkers[0].setLabel('Incendio activo: Cámara Cerro Catedral')
        setShowNotifyModal(true)
      }
    })
  }

  // init map!
  useEffect(() => {
    window.addEventListener('load', () => {
      if (window.google) {
        map = new window.google.maps.Map(
          document.getElementById('my-google-map-instance'),
          defaults,
        )

        // add station markers
        stationMarkers = stations.map(({ name, pos }) => {
          return new google.maps.Marker({
            position: pos,
            map,
            icon: {
              url: station,
              labelOrigin: new google.maps.Point(20, 52),
              scaledSize: new google.maps.Size(
                STATION_ICON_SCALE,
                STATION_ICON_SCALE,
              ),
            },
          })
        })

        // add camera markers
        cameraMarkers = cameras.map(({ name, pos }) => {
          return new google.maps.Marker({
            position: pos,
            map,
            icon: {
              url: camera,
              labelOrigin: new google.maps.Point(20, 52),
              scaledSize: new google.maps.Size(
                CAMERA_ICON_SCALE,
                CAMERA_ICON_SCALE,
              ),
            },
          })
        })

        setTimeout(() => {
          // calculateRoute(map)
          cameraMarkers[0].setIcon({
            url: cameraRed,
            labelOrigin: new google.maps.Point(20, 72),
            scaledSize: new google.maps.Size(
              CAMERA_ICON_SCALE,
              CAMERA_ICON_SCALE,
            ),
          })

          showErrorMsg('Se detectó un incendio en una de tus cámaras.')
          setShowModal(true)
        }, 5000)
      }
    })
  }, [])

  return (
    <>
      <div
        id="my-google-map-instance"
        style={{ height: '100vh', width: '100%' }}
      />
      <FireModal
        open={showModal}
        setOpen={setShowModal}
        onConfirm={() => {
          setShowModal(false)
          calculateRoute(map)
        }}
      />
      <NotifyModal open={showNotifyModal} setOpen={setShowNotifyModal} />
      {/* <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDdp0WGI_lYj7cd4d6WUTg1d9ndo4m0p9Q' }}
        defaultCenter={defaults.center}
        defaultZoom={defaults.zoom}
      >
        {stations.map(({ name, pos }) => (
          <Pin type="station" key={name} lat={pos.lat} lng={pos.lng} />
        ))}
        {cameras.map(({ name, pos }) => (
          <Pin type="camera" key={name} lat={pos.lat} lng={pos.lng} />
        ))}
      </GoogleMapReact> */}
    </>
  )
}

export default memo(Map)

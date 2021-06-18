import React, { useContext } from 'react'
import { Camera } from 'types/domain'
import { Badge, Box, Heading } from '@chakra-ui/layout'
import CameraContext from 'context/cameraContext'
import { mockedVideos } from './mocks'

const CameraName: React.FC<any> = ({ children }) => (
  <Heading size="md" color="white">
    {children}
  </Heading>
)

const Status: React.FC<any> = ({ status }) => {
  let colorScheme = 'green'

  if (status === 'warning') {
    colorScheme = 'yellow'
  } else if (status === 'fire_in_progress') {
    colorScheme = 'red'
  }

  return <Badge colorScheme={colorScheme}>{status}</Badge>
}

const VideoWrapper: React.FC<any> = ({ camera, children }) => {
  const { toggleCameraLarge } = useContext(CameraContext)

  return (
    <Box
      borderRadius={20}
      onClick={() => toggleCameraLarge(camera)}
      cursor="pointer"
    >
      <Box padding="2" background="#253649">
        <CameraName>{camera.name}</CameraName>
      </Box>
      {children}
      <Box padding="2" background="#253649">
        <Status status={camera.status} />
      </Box>
    </Box>
  )
}

export interface CamProps {
  camera: Camera
}

const Cam: React.FC<CamProps> = ({ camera }) => {
  if (camera.video_source_url === '.mp4') {
    return (
      <VideoWrapper camera={camera}>
        <video style={{ maxHeight: 275 }} autoPlay loop>
          <source src={mockedVideos[camera.id]} type="video/mp4" />
        </video>
      </VideoWrapper>
    )
  }

  return (
    <VideoWrapper camera={camera}>
      <img
        alt="source"
        style={{ height: 240, width: '100%' }}
        src={camera.video_source_url}
      />
    </VideoWrapper>
  )
}

export default Cam

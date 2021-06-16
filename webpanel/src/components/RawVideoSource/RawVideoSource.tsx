import { Box } from '@chakra-ui/layout'
import { mockedVideos } from 'pages/cameras/mocks'
import React from 'react'
import { Camera } from 'types/domain'

export interface RawVideoSourceProps {
  camera: Camera
  style?: any
}

const RawVideoSource: React.FC<RawVideoSourceProps> = ({
  camera,
  style = {},
}) => {
  if (camera.video_source_url === '.mp4') {
    return (
      <Box>
        <video
          style={{ marginLeft: 'auto', marginRight: 'auto', ...style }}
          autoPlay
          loop
        >
          <source src={mockedVideos[camera.id]} type="video/mp4" />
        </video>
      </Box>
    )
  }

  return (
    <Box>
      <img
        style={{ marginLeft: 'auto', marginRight: 'auto', ...style }}
        src={camera.video_source_url}
        alt="video-source"
      />
    </Box>
  )
}

export default RawVideoSource

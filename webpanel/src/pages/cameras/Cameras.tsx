import React from 'react'
import { Box, Heading, Spacer, SimpleGrid } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import Cam from './Cam'
import { fetchCameras } from 'services/alerts'
import FullScreenLoading from 'components/FullScreenLoading'
import ErrorScreen from 'components/ErrorScreen/ErrorScreen'
import { mockedCameras } from './mocks'

const Cameras: React.FC<any> = () => {
  const { data, isLoading, isError } = useQuery('fetchCameras', fetchCameras)

  if (isLoading) {
    return <FullScreenLoading />
  }

  if (isError) {
    return (
      <ErrorScreen message="Hubo un error al intentar buscar las cámaras activas" />
    )
  }

  const cameras = [...(data || []), ...mockedCameras]

  return (
    <Box padding="5">
      <Heading size="lg">Cámaras inteligentes</Heading>
      <Spacer height="10" />
      <SimpleGrid minChildWidth="320px" spacing="20px">
        {cameras?.map((cam) => (
          <Cam key={cam.id} camera={cam} />
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default Cameras

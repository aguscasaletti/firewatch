import React from 'react'
import { Box, Flex, Heading, SimpleGrid, Spacer, Text } from '@chakra-ui/layout'
import FullScreenLoading from 'components/FullScreenLoading'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { fetchAlertByID } from 'services/alerts'
import { Alert, AlertIcon } from '@chakra-ui/react'

const AlertPreview: React.FC<any> = () => {
  const { id: alertID } = useParams<{ id: string }>()
  const { data, isLoading } = useQuery(
    ['fetchAleryById', alertID],
    () => {
      return fetchAlertByID(+alertID)
    },
    {
      cacheTime: 0,
    },
  )

  if (isLoading) {
    return <FullScreenLoading />
  }

  return (
    <Box padding="5">
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <Heading size="md">Alerta #{data?.id} - Córdoba Noroeste</Heading>
        </Flex>
      </Flex>
      <Spacer height="10" />
      <SimpleGrid spacing="10">
        <Box>
          <Heading mb="3" size="md">
            Imagen de cámara
          </Heading>
          <Text mb="3">
            Revisá la siguiente captura para confirmar o descartar la existencia
            de un incendio.
          </Text>
          <img
            alt="capture"
            src={`data:image/jpeg;base64,${data?.image_capture}`}
          />
        </Box>{' '}
        <Alert status="warning">
          <AlertIcon />
          Para hacer un seguimiento sobre el incidente accedé al panel web
        </Alert>
        <Box>
          <Heading mb="3" size="md">
            Datos del incidente
          </Heading>
          <Text mb="3">
            <b>Fecha y Hora:</b> 22/06/2021 14:15 hs
          </Text>
          <Text mb="3">
            <b>Nivel de confianza:</b> 75%
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  )
}

export default AlertPreview

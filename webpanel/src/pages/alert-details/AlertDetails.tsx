import { Image } from '@chakra-ui/image'
import { Box, Flex, Heading, SimpleGrid, Spacer, Text } from '@chakra-ui/layout'
import FullScreenLoading from 'components/FullScreenLoading'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router'
import GoogleMapReact from 'google-map-react'
import { fetchAlertByID } from 'services/alerts'
import { FiCheck } from 'react-icons/fi'
import { AiFillVideoCamera, AiFillFire } from 'react-icons/ai'
import { IoMdNotifications } from 'react-icons/io'
import { Textarea } from '@chakra-ui/textarea'
import { Button } from '@chakra-ui/button'
import BackButton from 'components/BackButton/BackButton'

type LatLng = {
  lat: number
  lng: number
}

const AlertDetails: React.FC<any> = () => {
  const history = useHistory()
  const { id: alertID } = useParams<{ id: string }>()
  const [latlng, setLatLng] = useState<LatLng>({
    lat: -31.265049,
    lng: -64.378698,
  })
  const { data, isLoading, isError } = useQuery(
    ['fetchAleryById', alertID],
    () => {
      return fetchAlertByID(+alertID)
    },
  )

  if (isLoading) {
    return <FullScreenLoading />
  }

  return (
    <Box padding="5">
      <Flex justifyContent="space-between">
        <Flex>
          <BackButton />
          <Heading size="lg">Alerta #{data?.id} - Córdoba Noroeste</Heading>
        </Flex>
        <Box>
          <Button
            onClick={() => {
              history.push(`/home/alerts/${alertID}/notifications`)
            }}
          >
            <IoMdNotifications size={20} />
            <Text ml="1">Notificaciones</Text>
          </Button>
          <Button ml="3" colorScheme="green">
            <FiCheck size={20} />
            <Text ml="1">Guardar</Text>
          </Button>
        </Box>
      </Flex>
      <Spacer height="10" />
      <SimpleGrid spacing="10" columns={2}>
        <Box>
          <Heading mb="3" size="md">
            Captura
          </Heading>
          <Text mb="3">
            Revisá la siguiente captura para confirmar o descartar la existencia
            de un incendio.
          </Text>
          <img src={`data:image/jpeg;base64,${data?.image_capture}`} />
        </Box>
        <Box>
          <Heading mb="3" size="md">
            Mapa
          </Heading>
          <Text mb="3">Ubicá el incendio en el mapa.</Text>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: 'AIzaSyDbFv73ynKW138QGoGufGHbZtEoyb8uwqg',
            }}
            defaultCenter={latlng}
            defaultZoom={12}
          >
            <div
              // @ts-ignore
              lat={latlng.lat}
              lng={latlng.lng}
              style={{
                width: 200,
                height: 200,
                opacity: 0.5,
                borderRadius: '50%',
                backgroundColor: 'red',
                transform: 'translate(-40%, -35%)',
              }}
            />
            <AiFillVideoCamera
              // @ts-ignore
              lat={latlng.lat}
              lng={latlng.lng}
              size={40}
              color="#333"
            />
            <AiFillFire
              // @ts-ignore
              lat={-31.24903}
              lng={-64.428698}
              size={45}
              color="red"
            />
          </GoogleMapReact>
        </Box>
        <Box>
          <Heading mb="3" size="md">
            Observaciones
          </Heading>
          <Textarea
            placeholder="Escribí acá tus observaciones sobre el incidente"
            size="lg"
            height={240}
          />
        </Box>
      </SimpleGrid>
    </Box>
  )
}

export default AlertDetails

import { Image } from '@chakra-ui/image'
import { Box, Flex, Heading, SimpleGrid, Spacer, Text } from '@chakra-ui/layout'
import FullScreenLoading from 'components/FullScreenLoading'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router'
import GoogleMapReact from 'google-map-react'
import { fetchAlertByID } from 'services/alerts'
import { FiCheck } from 'react-icons/fi'
import { GiPoliceBadge } from 'react-icons/gi'
import { AiFillVideoCamera, AiFillFire } from 'react-icons/ai'
import { IoMdCall, IoMdNotifications } from 'react-icons/io'
import { BsListCheck } from 'react-icons/bs'
import { Textarea } from '@chakra-ui/textarea'
import { Button, IconButton } from '@chakra-ui/button'
import BackButton from 'components/BackButton/BackButton'

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react'

type LatLng = {
  lat: number
  lng: number
}

const mockedUsers = [
  {
    name: 'Juan García',
  },
  {
    name: 'Mateo Silva',
  },
  {
    name: 'Miguel Martinez',
  },
  {
    name: 'Sebastián Pereira',
  },
  {
    name: 'Roberto Perez',
  },
  {
    name: 'Manuel Rossi',
  },
]

const AlertNotifications: React.FC<any> = () => {
  const history = useHistory()
  const { id: alertID } = useParams<{ id: string }>()
  const [latlng, setLatLng] = useState<LatLng>({
    lat: -31.24903,
    lng: -64.428698,
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
          <Heading size="lg">Alerta #{data?.id} - Notificaciones</Heading>
        </Flex>
        <Box>
          <Button
            onClick={() => {
              history.push(`/home/alerts/${alertID}/details`)
            }}
          >
            <BsListCheck size={20} />
            <Text ml="2">Detalles</Text>
          </Button>
          <Button ml="3" colorScheme="green">
            <FiCheck size={20} />
            <Text ml="1">Guardar</Text>
          </Button>
        </Box>
      </Flex>
      <Spacer height="10" />
      <SimpleGrid spacing="10" columns={2}>
        <Box height={500}>
          <Heading mb="3" size="md">
            Cuarteles cercanos al incidente
          </Heading>
          <Text mb="3">
            Cuartel más cercano: <b>Cuartel Cosquín Nº 2</b>
          </Text>
          <Text mb="3">
            Distancia aproximada al lugar: <b>2,3 km</b>
          </Text>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: '',
            }}
            defaultCenter={latlng}
            defaultZoom={12.5}
          >
            <AiFillFire
              // @ts-ignore
              lat={-31.24903}
              lng={-64.428698}
              size={45}
              color="orange"
            />
            <GiPoliceBadge
              // @ts-ignore
              lat={-31.23903}
              lng={-64.468698}
              size={45}
              color="red"
            />
            <GiPoliceBadge
              // @ts-ignore
              lat={-31.28903}
              lng={-64.468698}
              size={45}
              color="#555"
            />
            <GiPoliceBadge
              // @ts-ignore
              lat={-31.23903}
              lng={-64.378698}
              size={45}
              color="#555"
            />
          </GoogleMapReact>
        </Box>
        <Box>
          <Heading mb="3" size="md">
            Notificar al personal de guardia
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Cuartel</Th>
                <Th>Usuario</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockedUsers.map((user) => (
                <Tr>
                  <Td>Cosquín Nº 2</Td>
                  <Td>{user.name}</Td>
                  <Td>
                    <Flex>
                      <IconButton
                        aria-label="Notificar"
                        icon={<IoMdNotifications />}
                      />
                      <IconButton
                        ml="2"
                        aria-label="Llamar"
                        icon={<IoMdCall />}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Cuartel</Th>
                <Th>Usuario</Th>
                <Th>Acciones</Th>
              </Tr>
            </Tfoot>
          </Table>
        </Box>
      </SimpleGrid>
    </Box>
  )
}

export default AlertNotifications

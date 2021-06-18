import React, { useState } from 'react'
import { Box, Flex, Heading, SimpleGrid, Spacer, Text } from '@chakra-ui/layout'
import { useMutation, useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useToast,
} from '@chakra-ui/react'
import GoogleMapReact from 'google-map-react'
import { fetchAlertByID, sendNotification } from 'services/alerts'
import { GiPoliceBadge } from 'react-icons/gi'
import { AiFillFire } from 'react-icons/ai'
import { IoMdCall, IoMdNotifications } from 'react-icons/io'
import { AiOutlineNotification } from 'react-icons/ai'
import { BsListCheck } from 'react-icons/bs'
import { Button, IconButton } from '@chakra-ui/button'
import BackButton from 'components/BackButton/BackButton'
import FullScreenLoading from 'components/FullScreenLoading'

const mockedUsersByStation = [
  [
    {
      name: 'Juan José Nievas',
    },
    {
      name: 'Mateo Silva',
    },
    {
      name: 'Micaela Martinez',
    },
    {
      name: 'María Perez',
    },
    {
      name: 'Manuel Rossi',
    },
  ],
  [
    {
      name: 'Giselle Sordián',
    },
    {
      name: 'Camila Moriondo',
    },
    {
      name: 'Adriana Casaletti',
    },
    {
      name: 'Elther Moriondo',
    },
  ],
  [
    {
      name: 'Sebastián Marquez',
    },
    {
      name: 'Nicolás Bueno',
    },
    {
      name: 'Analía Martinez',
    },
    {
      name: 'Roberto Perez',
    },
  ],
]

const mockedStations = [
  {
    lat: -31.23903,
    lng: -64.468698,
    distance: '2,3 km',
  },
  {
    lat: -31.28903,
    lng: -64.468698,
    distance: '4,5 km',
  },
  {
    lat: -31.23903,
    lng: -64.378698,
    distance: '5,1 km',
  },
]

const fireLocation = {
  lat: -31.24903,
  lng: -64.428698,
}

const AlertNotifications: React.FC<any> = () => {
  const history = useHistory()
  const toast = useToast()
  const { id: alertID } = useParams<{ id: string }>()
  const [selectedStationIdx, setSelectedStationIdx] = useState(0)
  const { data, isLoading } = useQuery(['fetchAleryById', alertID], () => {
    return fetchAlertByID(+alertID)
  })
  const [notificationLoading, setNotificationLoading] = useState(false)
  const [notifyAllLoading, setNotifyAllLoading] = useState(false)
  const sendNotificationMutation = useMutation(sendNotification(+alertID))

  // const calculateDirections = () => {
  //   const directionsService = new google.maps.DirectionsService()
  //   directionsService.route(
  //     {
  //       origin: {
  //         lat: mockedStations[selectedStationIdx].lat,
  //         lng: mockedStations[selectedStationIdx].lng,
  //       },
  //       destination: fireLocation,
  //       travelMode: google.maps.TravelMode.DRIVING,
  //     },
  //     (result, status) => {
  //       console.log(result, status)
  //     },
  //   )
  // }

  if (isLoading) {
    return <FullScreenLoading />
  }

  return (
    <Box padding="5">
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <BackButton />
          <Heading size="md">Alerta #{data?.id} - Notificaciones</Heading>
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
        </Box>
      </Flex>
      <Spacer height="10" />
      <SimpleGrid spacing="10" columns={2}>
        <Box>
          <Flex mb="2" alignItems="center" justifyContent="space-between">
            <Heading mb="3" size="md">
              Personal de guardia
            </Heading>
            <Button
              onClick={async () => {
                setNotifyAllLoading(true)
                await new Promise((res) => setTimeout(res, 1000))
                setNotifyAllLoading(false)
                toast({
                  title: 'Notificación exitosa',
                  description: `Se enviaron ${mockedUsersByStation[selectedStationIdx].length} notificaciones`,
                  duration: 3000,
                })
              }}
              isLoading={notifyAllLoading}
            >
              <AiOutlineNotification />
              <Box ml="2">Notificar a todos</Box>
            </Button>
          </Flex>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Cuartel</Th>
                <Th>Nombre</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockedUsersByStation[selectedStationIdx].map((user) => (
                <Tr>
                  <Td>Cosquín Nº {selectedStationIdx + 1}</Td>
                  <Td>{user.name}</Td>
                  <Td>
                    <Flex>
                      <Popover>
                        <PopoverTrigger>
                          <IconButton
                            aria-label="Notificar"
                            icon={<IoMdNotifications />}
                          />
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Notificar</PopoverHeader>
                          <PopoverBody>
                            ¿Enviar notificación a <b>+54351490389</b>?
                            <Button
                              onClick={async () => {
                                setNotificationLoading(true)
                                await sendNotificationMutation.mutateAsync()
                                setNotificationLoading(false)
                                toast({
                                  title: 'Notificación exitosa',
                                  description: 'Se envió 1 notificación',
                                  duration: 3000,
                                })
                              }}
                              isLoading={notificationLoading}
                              colorScheme="yellow"
                              mt="3"
                              float="right"
                            >
                              <IoMdNotifications />
                              <Box ml="1">Notificar</Box>
                            </Button>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger>
                          <IconButton
                            ml="2"
                            aria-label="Llamar"
                            icon={<IoMdCall />}
                          />
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Llamar</PopoverHeader>
                          <PopoverBody>
                            ¿Llamar a <b>+54351490389</b>?
                            <Button colorScheme="green" mt="3" float="right">
                              <IoMdCall />
                              <Box ml="1">Iniciar llamada</Box>
                            </Button>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
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
        <Box height={500}>
          <Heading mb="3" size="md">
            Cuarteles
          </Heading>
          <Text mb="3">
            Cuartel más cercano:{' '}
            <b>Cuartel Cosquín Nº {selectedStationIdx + 1}</b>
          </Text>
          <Text mb="3">
            Distancia aproximada al lugar:{' '}
            <b>{mockedStations[selectedStationIdx].distance}</b>
          </Text>
          <Box height={350} width={450}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: process.env['REACT_APP_GOOGLE_MAPS_API_KEY'] || '',
              }}
              defaultCenter={{
                lat: -31.28503,
                lng: -64.416698,
              }}
              defaultZoom={12}
            >
              <AiFillFire
                // @ts-ignore
                lat={fireLocation.lat}
                lng={fireLocation.lng}
                size={45}
                color="orange"
              />
              {mockedStations.map(({ lat, lng }, idx) => (
                <GiPoliceBadge
                  // @ts-ignore
                  lat={lat}
                  lng={lng}
                  size={45}
                  color={idx === selectedStationIdx ? 'red' : '#999'}
                  key={`${lat}${lng}`}
                  onClick={() => {
                    setSelectedStationIdx(idx)
                  }}
                />
              ))}
            </GoogleMapReact>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  )
}

export default AlertNotifications

import React, { useState, useRef, useEffect } from 'react'
import { Box, Flex, Heading, SimpleGrid, Spacer, Text } from '@chakra-ui/layout'
import FullScreenLoading from 'components/FullScreenLoading'
import { useMutation, useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router'
import GoogleMapReact from 'google-map-react'
import { fetchAlertByID, updateAlert } from 'services/alerts'
import { FiCheck } from 'react-icons/fi'
import { AiFillVideoCamera, AiFillFire } from 'react-icons/ai'
import { IoMdNotifications } from 'react-icons/io'
import { Textarea } from '@chakra-ui/textarea'
import { Button } from '@chakra-ui/button'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react'
import BackButton from 'components/BackButton/BackButton'

type LatLng = {
  lat: number
  lng: number
}

const AlertDetails: React.FC<any> = () => {
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(false)
  const [details, setDetails] = useState('')
  const toast = useToast()
  const cancelRef = useRef(null)
  const { id: alertID } = useParams<{ id: string }>()
  const updateAlertMutation = useMutation(updateAlert(+alertID))
  const [fireLocation, setFireLocation] = useState<LatLng>()
  const cameraLocation = {
    lat: -31.265049,
    lng: -64.378698,
  }
  const { data, isLoading, refetch } = useQuery(
    ['fetchAleryById', alertID],
    () => {
      return fetchAlertByID(+alertID)
    },
    {
      cacheTime: 0,
    },
  )

  useEffect(() => {
    if (data) {
      setDetails(data.details)
      setFireLocation({ lat: data.location_lat, lng: data.location_lng })
    }
  }, [data])
  const onClose = () => setIsOpen(false)

  if (isLoading) {
    return <FullScreenLoading />
  }

  return (
    <Box padding="5">
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <BackButton />
          <Heading size="md">Alerta #{data?.id} - Córdoba Noroeste</Heading>
        </Flex>
        <Box>
          {/* <Button
            onClick={() => {
              cameraContext.toggleCameraSmall(data?.camera)
            }}
          >
            <AiOutlineVideoCamera size={20} />
            <Text ml="1">Ver video</Text>
          </Button> */}
          <Button
            ml="3"
            onClick={async () => {
              await updateAlertMutation.mutateAsync({
                locationLat: fireLocation?.lat,
                locationLng: fireLocation?.lng,
                details,
              })
              refetch()
              history.push(`/home/alerts/${alertID}/notifications`)
            }}
          >
            <IoMdNotifications size={20} />
            <Text ml="1">Notificaciones</Text>
          </Button>
          <Button
            onClick={() => {
              setIsOpen(true)
            }}
            ml="3"
            colorScheme="green"
          >
            <FiCheck size={20} />
            <Text ml="1">Finalizar</Text>
          </Button>
        </Box>
      </Flex>
      <Spacer height="10" />
      <SimpleGrid spacing="10" columns={2}>
        <Box>
          <Heading mb="3" size="md">
            Mapa
          </Heading>
          <Text mb="3">Ubicá el incendio en el mapa.</Text>
          <Box width={500} height={350}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: process.env['REACT_APP_GOOGLE_MAPS_API_KEY'] || '',
              }}
              defaultCenter={{
                lat: -31.295049,
                lng: -64.378698,
              }}
              defaultZoom={12}
              onClick={({ lat, lng }) => {
                setFireLocation({ lat, lng })
              }}
            >
              <div
                // @ts-ignore
                lat={cameraLocation.lat}
                lng={cameraLocation.lng}
                style={{
                  width: 200,
                  height: 200,
                  opacity: 0.5,
                  borderRadius: '50%',
                  backgroundColor: 'red',
                  transform: 'translate(-40%, -40%)',
                }}
              />
              <AiFillVideoCamera
                // @ts-ignore
                lat={cameraLocation.lat}
                lng={cameraLocation.lng}
                size={40}
                color="#333"
              />
              {fireLocation && (
                <div
                  // @ts-ignore
                  lat={fireLocation.lat}
                  lng={fireLocation.lng}
                  style={{
                    opacity: 0.9,
                    borderRadius: '50%',
                    transform: 'translate(-100%, -50%)',
                  }}
                >
                  <AiFillFire
                    // @ts-ignore
                    lat={fireLocation.lat}
                    lng={fireLocation.lng}
                    size={45}
                    color="orange"
                  />
                </div>
              )}
            </GoogleMapReact>
          </Box>
        </Box>
        <Box>
          <Heading mb="3" size="md">
            Observaciones
          </Heading>
          <Text mb="3">Escribí acá tus observaciones sobre el incidente.</Text>
          <Textarea
            value={details}
            onChange={(event) => {
              setDetails(event.target.value)
            }}
            placeholder=""
            size="lg"
            height={240}
          />
        </Box>

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
            width="80%"
          />
        </Box>
      </SimpleGrid>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Finalizar alerta
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que deseas finalizar esta alerta? Se dará por
              resuelto el caso.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={async () => {
                  await updateAlertMutation.mutateAsync({ status: 'finalized' })
                  toast({
                    status: 'success',
                    duration: 3000,
                    description: 'Alerta finalizada con éxito',
                    title: 'Alerta finalizada',
                  })
                  onClose()
                  history.push('/home/alerts')
                }}
                ml={3}
              >
                Finalizar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

export default AlertDetails

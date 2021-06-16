import React, { createContext, useState, useEffect } from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
} from '@chakra-ui/react'
import { useMutation, useQuery } from 'react-query'
import { Alert } from 'types/domain'
import { Box, Flex } from '@chakra-ui/layout'
import RawVideoSource from 'components/RawVideoSource/RawVideoSource'
import { fetchAlertsPendingReview, updateAlert } from 'services/alerts'
import { FiAlertCircle } from 'react-icons/fi'

interface AlertsContextValue {
  onClose: () => void
}

const AlertsContext = createContext<AlertsContextValue>({
  onClose: () => {},
})
const { Provider } = AlertsContext

export const AlertsContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [alert, setAlert] = useState<Alert>()
  const { data = [] } = useQuery(
    'fetchAlertsPendingReview',
    fetchAlertsPendingReview,
    {
      refetchInterval: 3000,
    },
  )
  const updateAlertMutation = useMutation(updateAlert(alert?.id || 0))

  useEffect(() => {
    if (data.length) {
      setAlert(data[0])

      setTimeout(onOpen, 1000)
    }
  }, [data.length, data, onOpen])

  // TODO snooze discarded alerts camera for a couple minutes
  const onDiscardAlert = async () => {
    await updateAlertMutation.mutateAsync({ status: 'discarded' })
    onClose()
  }

  const onConfirmAlert = async () => {
    await updateAlertMutation.mutateAsync({ status: 'confirmed' })
    onClose()
  }

  return (
    <Provider
      value={{
        onClose: () => {},
      }}
    >
      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="#1d2d3f" margin="0">
          <ModalHeader color="white">
            <Flex>
              <FiAlertCircle size="30" />
              <Box ml="3">
                Alerta: incendio detectado en {alert?.camera?.name}
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            {alert && alert.camera && (
              <Box key={alert.camera.id}>
                <RawVideoSource
                  camera={alert.camera}
                  style={{ maxHeight: 'calc(100vh - 150px)' }}
                />
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onDiscardAlert} mr="3" variant="ghost">
              Descartar
            </Button>
            <Button
              colorScheme="red"
              backgroundColor="red.500"
              color="white"
              mr="3"
              onClick={onConfirmAlert}
            >
              Confirmar incendio
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {children}
    </Provider>
  )
}

export default AlertsContext

import React, { createContext, useState } from 'react'
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
import Cam from 'pages/cameras/Cam'
import { useMutation, useQuery } from 'react-query'
import { fetchCurrentUserInfo } from 'services/user'
import { Camera, Route, UserInfo } from 'types/domain'
import { Box } from '@chakra-ui/layout'
import RawVideoSource from 'components/RawVideoSource/RawVideoSource'

interface CameraContextValue {
  toggleCameraLarge: (cam?: Camera) => void
  toggleCameraSmall: (cam?: Camera) => void
}

const CameraContext = createContext<CameraContextValue>({
  toggleCameraLarge: () => undefined,
  toggleCameraSmall: () => undefined,
})
const { Provider } = CameraContext

export const CameraContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const {
    isOpen: isOpenLarge,
    onOpen: onOpenLarge,
    onClose: onCloseLarge,
    onToggle: onToggleLarge,
  } = useDisclosure()
  const {
    isOpen: isOpenSmall,
    onOpen: onOpenSmall,
    onClose: onCloseSmall,
    onToggle: onToggleSmall,
  } = useDisclosure()
  const [camera, setCamera] = useState<Camera>()

  const toggleCameraLarge = (cam?: Camera) => {
    setCamera(cam)

    if (cam) {
      onOpenLarge()
    } else {
      onCloseLarge()
    }
  }

  const toggleCameraSmall = (cam?: Camera) => {
    setCamera(cam)
    if (cam) {
      onOpenSmall()
    } else {
      onCloseSmall()
    }
  }

  return (
    <Provider
      value={{
        toggleCameraLarge,
        toggleCameraSmall,
      }}
    >
      <Modal size="full" isOpen={isOpenLarge} onClose={onCloseLarge}>
        <ModalOverlay />
        <ModalContent backgroundColor="#1d2d3f" margin="0">
          <ModalHeader color="white">{camera?.name}</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            {camera && (
              <Box key={camera.id}>
                <RawVideoSource
                  camera={camera}
                  style={{ maxHeight: 'calc(100vh - 150px)' }}
                />
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onCloseLarge} variant="ghost">
              Cerrar
            </Button>
            <Button
              onClick={() => {
                onCloseLarge()
                onOpenSmall()
              }}
              mr={3}
              variant="ghost"
            >
              Minimizar
            </Button>
            <Button
              backgroundColor="red.500"
              color="white"
              colorScheme="red"
              mr={3}
              onClick={onCloseLarge}
            >
              Reportar incendio
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        closeOnOverlayClick={false}
        size="xs"
        isOpen={isOpenSmall}
        onClose={onCloseSmall}
      >
        <ModalContent
          marginTop="calc(100vh - 250px)"
          marginLeft="calc(100vw - 350px)"
          containerProps={{
            pointerEvents: 'none',
          }}
        >
          <ModalCloseButton pointerEvents="all" zIndex={999} />
          <ModalBody padding="0">
            {camera && (
              <Box>
                <RawVideoSource camera={camera} />
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      {children}
    </Provider>
  )
}

export default CameraContext

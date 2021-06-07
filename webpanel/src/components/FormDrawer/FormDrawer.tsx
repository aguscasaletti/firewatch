import { Button } from '@chakra-ui/button'
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/modal'
import React from 'react'

interface FormDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSave?: () => void
}

const FormDrawer: React.FC<FormDrawerProps> = ({
  children,
  title,
  isOpen,
  onClose,
  onSave,
}) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">{title}</DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave} type="submit" colorScheme="blue">
            Guardar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default FormDrawer

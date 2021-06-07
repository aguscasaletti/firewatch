import React, { useCallback, useRef, useState } from 'react'
import { Box, Heading, Spacer, SimpleGrid } from '@chakra-ui/react'
import DataTable, { DataTableEntity } from 'components/DataTable/DataTable'
import { Camera } from 'types/domain'
import { useTableQueryAdapter } from 'hooks/useTableQueryAdapter'
import { IoOpenOutline } from 'react-icons/io5'
import { useHistory } from 'react-router'
import { useDisclosure } from '@chakra-ui/hooks'
import FormDrawer from 'components/FormDrawer/FormDrawer'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useMutation } from 'react-query'
import { useToast } from '@chakra-ui/toast'
import video from 'assets/san_diego_border_fire_trimmed.mp4'
import VideoSource from './VideoSource'

const Cameras: React.FC<any> = () => {
  const history = useHistory()
  const toast = useToast()

  return (
    <Box padding="5">
      <Heading size="lg">Cámaras activas</Heading>
      <Spacer height="10" />
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <img src="http://localhost:8080/cam.mjpg" />
        <VideoSource src={video} />
        <VideoSource src={video} />
      </SimpleGrid>
    </Box>
  )
}

export default Cameras

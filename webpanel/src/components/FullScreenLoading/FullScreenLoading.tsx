import React from 'react'
import { CircularProgress, Flex } from '@chakra-ui/react'

const FullScreenLoading: React.FC = () => {
  return (
    <Flex flex={1} height="100%" justifyContent="center" alignItems="center">
      <Flex direction="column" alignItems="center">
        <CircularProgress isIndeterminate color="blue.600" />
      </Flex>
    </Flex>
  )
}

export default FullScreenLoading

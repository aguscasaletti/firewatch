import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'

interface ErrorScreenProps {
  message: string
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message }) => {
  return (
    <Flex flex={1} height="100%" justifyContent="center" alignItems="center">
      <Flex direction="column" alignItems="center">
        <Text textAlign="center" maxWidth="90%">
          <WarningIcon w={5} h={5} /> {message}
        </Text>
      </Flex>
    </Flex>
  )
}

export default ErrorScreen

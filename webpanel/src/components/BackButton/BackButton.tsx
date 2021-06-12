import { IconButton } from '@chakra-ui/button'
import { ArrowBackIcon } from '@chakra-ui/icons'
import React from 'react'
import { useHistory } from 'react-router'

const BackButton: React.FC<any> = () => {
  const history = useHistory()

  return (
    <IconButton
      aria-label="go-back"
      onClick={history.goBack}
      icon={<ArrowBackIcon h={7} w={8} />}
      backgroundColor="transparent"
      marginRight="3"
      verticalAlign="center"
    />
  )
}

export default BackButton

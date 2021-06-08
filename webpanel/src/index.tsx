import React from 'react'
import ReactDOM from 'react-dom'
import { ColorModeScript } from '@chakra-ui/react'

import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode="dark" />
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

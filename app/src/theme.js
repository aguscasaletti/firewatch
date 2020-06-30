import { createMuiTheme } from '@material-ui/core/styles'
import primary from '@material-ui/core/colors/indigo'
import secondary from '@material-ui/core/colors/red'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      ...primary,
      main: primary[900],
      panel: '#121858',
    },
    secondary: {
      ...secondary,
      main: secondary[900],
    },
  },
})

export default theme

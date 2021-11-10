import React from 'react'
import MainRouter from './MainRouter'
import {BrowserRouter} from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'

const App = () => {
  /* remove the server-side injected CSS once the server-side-rendered React component mounts */
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MainRouter/>
      </ThemeProvider>
    </BrowserRouter>
)}

/* marking app as hot using react-hot-loader to ensure live reloading of React components during development */
import { hot } from 'react-hot-loader'
export default hot(module)(App)
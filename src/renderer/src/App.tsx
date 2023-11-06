import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
// import { Router, Route } from "electron-router-dom";
import { HashRouter, Route, Routes } from 'react-router-dom'

import Home from './Home'
import Manager from './Manager'
import { ThemeProvider, createTheme } from '@mui/material/styles'

function App(): JSX.Element {
  const bladeTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  })
  return (
    <ThemeProvider theme={bladeTheme}>
      <HashRouter basename="/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/yz" element={<Manager />} />
          <Route path="*" element={<div>Route not supported!</div>} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App

import React from 'react'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/manrope'

import Navigation from './Navigation'

import 'react-toastify/dist/ReactToastify.css'
import '@leenguyen/react-flip-clock-countdown/dist/index.css'

const App: React.FC = () => {
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    </div>
  )
}

export default App

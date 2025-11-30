import React from 'react'
import AppRouter from './routes/AppRouter'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ToastContainer'

function App() {
  return (
    <ToastProvider>
      <AppRouter />
      <ToastContainer />
    </ToastProvider>
  )
}

export default App

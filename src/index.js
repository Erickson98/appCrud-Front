import './index.css'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Login from './Components/Login/Login.html'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import ViewElements from './Components/ViewElement/ViewElement.html'
import { StylesProvider } from '@material-ui/core/styles'
import User from './Components/User/User.html'
import { confirmedRefreshToken } from './Ruter/Account'
import { SocketContext, socket } from './Components/Entities/socket.io'
const App = () => {
  const [autentication, setAutentication] = useState(false)
  const [admin, setAdmin] = useState(false)
  const handleAutentication = (value) => {
    setAutentication(value)
  }
  const handle = () => {}
  const handleAdmin = (value) => {
    setAdmin(value)
  }
  useEffect(() => {
    async function getAutentication() {
      const enable = await confirmedRefreshToken()
      return enable.msg === 'success'
        ? handleAutentication(true)
        : 'no autenticated'
    }
  }, [])

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to={'/Login'} />} />
          <Route
            path="/Login"
            element={
              autentication ? (
                <Navigate to={'/ViewElement'} />
              ) : (
                <Login admi={admin} autentication={handleAutentication} />
              )
            }
          />
          <Route
            path="/ViewElement"
            element={
              autentication ? (
                <ViewElements
                  admin={handleAdmin}
                  admi={admin}
                  autentication={handleAutentication}
                  ty={autentication}
                  rt={handle}
                />
              ) : (
                <Navigate to={'/Login'} />
              )
            }
          />
          <Route
            path="/User/Admin"
            element={
              admin ? <User admin={handleAdmin} /> : <Navigate to={'/Login'} />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

ReactDOM.render(
  <StylesProvider injectFirst>
    <SocketContext.Provider value={socket}>
      <App />
    </SocketContext.Provider>
  </StylesProvider>,

  document.getElementById('root'),
)

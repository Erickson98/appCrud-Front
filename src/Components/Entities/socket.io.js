import React from 'react'

import socketio from 'socket.io-client'

export const socket = socketio.connect('https://appintern78.herokuapp.com')
export const SocketContext = React.createContext()

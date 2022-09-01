import io from 'socket.io-client'
const socket = io.connect('https://appintern78.herokuapp.com')

export const updateData = () => {
  socket.on('updateData', (data) => {
    return data.message
  })
}

export const getData = (elements) => {
  socket.emit('getPerson', { message: elements })
}

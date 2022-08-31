import { useState, useContext } from 'react'
import Person from '../../Ruter/Person'
import { ObserverData } from '../../helpers/Update.data.DDBB.js/ObserverData'
import { SubjectCollection } from '../../helpers/Update.data.DDBB.js/SubjectData'
import UserInstance from '../../helpers/User.Rol.Decorator/User.Class'
import { useNavigate } from 'react-router-dom'

import { SocketContext } from '../Entities/socket.io'
import { confirmedCredentials } from '../../Ruter/Account'

export const useControlEvent = (props) => {
  const socket = useContext(SocketContext)
  const [modalAdd, setModalAdd] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [modalView, setModalView] = useState(false)
  const [modalUser, setModalUser] = useState(false)
  const [id, setId] = useState(Number)
  const [data, setData] = useState([])
  const navigate = useNavigate()

  const observer = new ObserverData()
  const subject = new SubjectCollection()
  subject.subscribe(observer)
  observer.setSubject(subject)

  const eventModalAdd = () => {
    setModalAdd(!modalAdd)
  }
  const eventModalEdit = () => {
    setModalEdit(!modalEdit)
  }
  const eventModalDelete = () => {
    setModalDelete(!modalDelete)
  }
  const eventModalView = () => {
    setModalView(!modalView)
  }
  const eventModalUser = () => {
    setModalUser(!modalUser)
  }
  const eventUpdateData = (value) => {
    setData(value)
  }

  const eventGetElement = async (rol) => {
    UserInstance.getRol(rol)
    let sd = await UserInstance.getData()

    eventUpdateData(sd)
  }

  const eventSubmitAdd = async (values) => {
    eventModalAdd()
    const enable = await confirmedCredentials()
    if (enable?.msg == 'redirected') {
      return window.open('http://localhost:4000/auth/logout', '_self')
    }
    const newPerson = await Person().createPerson(values)
    subject.setData(newPerson.data)
    subject.notify()
    const elements = await observer.update()
    socket.emit('getPerson', { message: elements })
    eventUpdateData(elements)
  }

  const eventSubmitEdit = async (values) => {
    const enable = await confirmedCredentials()
    if (enable?.msg == 'redirected') {
      return window.open('http://localhost:4000/auth/logout', '_self')
    }
    delete values._id
    await Person().updatePerson(values, id)
    eventModalEdit()
    const elements = await Person().getPerson()
    socket.emit('getPerson', { message: elements })

    eventUpdateData(elements)
  }

  const eventElementDelete = async () => {
    const enable = await confirmedCredentials()
    if (enable?.msg == 'redirected') {
      return window.open('http://localhost:4000/auth/logout', '_self')
    }
    eventModalDelete()
    await Person().deletePerson(id)
    const elements = await Person().getPerson()
    socket.emit('getPerson', { message: elements })

    eventUpdateData(elements)
  }
  const eventElementAccion = (element, condition, entitie) => {
    setId(element._id)
    entitie(element)
    condition === 'Edit'
      ? eventModalEdit()
      : condition === 'Deleted'
      ? eventModalDelete()
      : eventModalView()
  }

  return [
    data,
    modalAdd,
    modalEdit,
    modalDelete,
    modalView,
    modalUser,
    eventModalAdd,
    eventModalEdit,
    eventModalDelete,
    eventModalView,
    eventModalUser,
    eventSubmitAdd,
    eventSubmitEdit,
    eventGetElement,
    eventElementAccion,
    eventElementDelete,
    eventUpdateData,
  ]
}

export const useEntite = () => {
  const [person, setPerson] = useState({
    name: '',
    LastName: '',
    Date: '',
    Id: '',
    Address: '',
  })

  const eventUpdateEdit = (element) => {
    setPerson(element)
  }

  return [person, eventUpdateEdit]
}

export const useEntiteUser = () => {
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    image: '',
    rol: '',
  })
  const eventUpdateEditUser = (element) => {
    setUser(element)
  }
  return [user, eventUpdateEditUser]
}

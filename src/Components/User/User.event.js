import { useState, useContext } from 'react'
import UserRouter from '../../Ruter/UserRouter'
import UserEntity from '../Entities/User.entity'
import { ObserverData } from '../../helpers/Update.data.DDBB.js/ObserverData'
import { SubjectCollection } from '../../helpers/Update.data.DDBB.js/SubjectData'
import UserInstance from '../../helpers/User.Rol.Decorator/User.Class'
import { getData } from '../../Socket.io/Socket'

import { SocketContext } from '../Entities/socket.io'

export const useControlEvent = () => {
  const socket = useContext(SocketContext)
  const [modalEdit, setModalEdit] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [modalView, setModalView] = useState(false)
  const [modalUser, setModalUser] = useState(false)
  const [dataUser, setDataUser] = useState([])
  const [idUser, setIdUser] = useState(String)
  const [usersList, setUsersList] = useState([])
  const [userName, setUserName] = useState(String)
  const observer = new ObserverData()
  const subject = new SubjectCollection()
  subject.subscribe(observer)
  observer.setSubject(subject)

  const eventModalEdit = () => {
    setModalEdit(!modalEdit)
  }
  const eventModalDelete = () => {
    setModalDelete(!modalDelete)
  }
  const eventModalView = () => {
    setModalView(!modalView)
  }
  const eventUsers = (value) => {
    setUsersList(value)
  }
  const eventModalUser = () => {
    setModalUser(!modalUser)
  }
  const eventUpdateData = (value) => {
    setDataUser(value)
  }
  const eventGetElementUser = async () => {
    UserInstance.getRol(UserEntity.Rol)
    const s = await UserRouter().get()
    setDataUser(s.Users)
  }

  const eventSubmitEditRol = async (values, currency) => {
    eventModalEdit()
    await UserRouter().put(values, values._id, currency)
    const sd = await UserRouter().get()
    socket.emit('getPerson', { message: sd })
    setDataUser(sd.Users)

    setUserName(values.Rol)
  }
  const eventElementDeleteUser = async () => {
    eventModalDelete()
    await UserRouter().delete(idUser)

    const sd = await UserRouter().get()
    getData(sd)
    setDataUser(sd.Users)
  }

  const eventElementAccionUser = (element, condition, entitie) => {
    setIdUser(element._id)
    entitie(element)
    condition === 'Edit' ? eventModalEdit() : eventModalDelete()
  }

  return [
    dataUser,
    modalEdit,
    modalDelete,
    modalView,
    modalUser,
    userName,
    usersList,
    eventModalEdit,
    eventModalDelete,
    eventModalView,
    eventModalUser,
    eventSubmitEditRol,
    eventGetElementUser,
    eventElementDeleteUser,
    eventElementAccionUser,
    eventUpdateData,
    eventUsers,
  ]
}

export const useEntite = () => {
  const [User, setUser] = useState({
    name: '',
    Rol: '',
  })
  const eventUpdateUser = (element) => {
    setUser(element)
  }

  return [User, eventUpdateUser]
}

export const useEntiteUser = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    image: '',
  })
  const eventUpdateEditUser = (element) => {
    setUser(element)
  }
  return [user, eventUpdateEditUser]
}

import {
  Typography,
  Button,
  Modal,
  Paper,
  Card,
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  DialogActions,
  DialogContentText,
  DialogContent,
  Dialog,
  DialogTitle,
  TextField,
  Avatar,
  Menu,
  MenuItem,
} from '@material-ui/core'
import GroupIcon from '@material-ui/icons/Group'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import MaterialTable from 'material-table'
import CloseIcon from '@material-ui/icons/Close'
import { General } from './ViewElement.props.materialTable'
import { Styles } from './ViewElement.propsMaterialUi'
import { useEffect, useState } from 'react'
import { useControlEvent, useEntite, useEntiteUser } from './ViewElement.event'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { personSchema, setTime } from '../Entities/Person.entity'
import personEntity from '../Entities/Person.entity'
import './ViewElement.styles.css'
import UserInstance from '../../helpers/User.Rol.Decorator/User.Class'
import UserEntity from '../Entities/User.entity'
import userList from '../Entities/UserList'
import { Account, confirmedAdmin, deleteCookies } from '../../Ruter/Account'
import { useNavigate } from 'react-router-dom'
import React, { useContext } from 'react'

import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import UserRouter from '../../Ruter/UserRouter'

import { SocketContext } from '../Entities/socket.io'

const ViewElements = (props) => {
  const socket = useContext(SocketContext)
  const styles = Styles()
  const [
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
  ] = useControlEvent(props)
  const [person, eventUpdateEdit] = useEntite()
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()
  const [user, eventUpdateEditUser] = useEntiteUser()

  const logOut = async () => {
    props.autentication()
    const list = userList[0].filter((x) => x.username != user.name)
    socket.emit('logOut', list)
    await UserRouter().delete(user.id)
    window.open('https://appintern78.herokuapp.com/auth/logout', '_self')
  }
  const handleClick = (event) => {
    setAnchorEl(!anchorEl)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClickAway = () => {
    setAnchorEl(false)
  }
  useEffect(async () => {
    const element = await Account()

    const username = element.user.name
    socket.auth = { username }

    socket.emit('newConnection', { username })
  }, [])
  useEffect(() => {
    async function checkAdmin() {
      const element = await confirmedAdmin()
      if (element.msg === 'success') {
        props.admin(true)
      }
    }

    checkAdmin()
  }, [])

  useEffect(() => {
    async function getData() {
      const element = await Account()
      socket.emit('logIn') //no se utiliza
      eventUpdateEditUser(element.user)
      eventGetElement(element.user?.rol)

      const username = element.user.name
      socket.auth = { username }
    }
    getData()
    setTimeout(async () => {
      const element = await Account()
      eventUpdateEditUser(element.user)
      eventGetElement(element.user?.rol)
    }, 1000)
  }, [])
  useEffect(() => {
    socket.on('users', (users) => {
      //funciona
      userList.length = 0
      userList.push(users)
    })
    socket.on('userss', (users) => {
      //funciona
      userList.length = 0
      userList.push(users)
    })
    socket.on('updateData', (data) => {
      //funciona
      eventUpdateData(data.message)
    })
    socket.on('UpdateRol', (userUpdate) => {
      //hasta el momemto no se utiliza

      eventUpdateEditUser((x) => [...x, userUpdate.rol])
    })
    socket.on('updateUsersList', (userUpdate) => {
      userList.length = 0
      userList.push(userUpdate)
    })

    //se probara ahora
    socket.on('updateOnViewElement', () => {
      setTimeout(async () => {
        const element = await Account()
        eventUpdateEditUser(element.user)
        eventGetElement(element.user?.rol)
      }, 1000)
    })
    socket.on('logOutUser', async () => {
      await logOut()
      alert('ds')
    })
  }, [socket])
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="mainContent">
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={0} square>
            <Card className="containerIcon">
              <Card className="carTwo">
                <GroupIcon className="iconProps"></GroupIcon>
              </Card>

              <Typography className="txtElement">Personas</Typography>
              <div className="addPerson">
                <ClickAwayListener onClickAway={handleClickAway}>
                  <div>
                    {user?.rol !== process.env.REACT_APP_API_ROL_NEW &&
                    user?.rol !== process.env.REACT_APP_API_ROL_INVITE ? (
                      <Button className="btnAddPerson" onClick={eventModalAdd}>
                        <AddCircleOutlineIcon />
                      </Button>
                    ) : (
                      ''
                    )}

                    <Button className="btnUserGoogle" onClick={handleClick}>
                      <Avatar src={user?.image} />
                    </Button>
                    {anchorEl && (
                      <div>
                        <Paper className="cardDropDownMenu">
                          <div className="containerDropDownMenu">
                            <div className="imgDropDown">
                              {' '}
                              <Avatar src={user?.image} />{' '}
                            </div>

                            <div className="textName">{user?.name}</div>
                            <div className="textEmail">{user?.email}</div>
                            {user?.rol === 'Admin' && (
                              <div className="">
                                <Button
                                  fullWidth={true}
                                  onClick={() => {
                                    navigate('/User/Admin')
                                  }}
                                >
                                  Usuarios
                                </Button>
                              </div>
                            )}

                            <hr />
                            <div className="closeSession">
                              <Button fullWidth={true} onClick={logOut}>
                                Cerrar sesión
                              </Button>
                            </div>
                          </div>
                        </Paper>
                      </div>
                    )}
                  </div>
                </ClickAwayListener>
              </div>
            </Card>
          </Paper>
        </ClickAwayListener>

        <MaterialTable
          columns={General.firstColumn}
          data={data}
          title={''}
          actions={UserInstance.getAcciones(
            eventElementAccion,
            eventUpdateEdit,
          )}
          options={{ actionsColumnIndex: 3 }}
          localization={{
            header: {
              actions: 'Acciones',
            },
          }}
        />
        <Modal open={modalAdd} onClose={eventModalAdd}>
          {
            <div className="formContentModal">
              <Formik
                initialValues={{ ...personEntity }}
                validationSchema={personSchema}
                onSubmit={(values, { resetForm }) => {
                  eventSubmitAdd(values)
                  resetForm()
                }}
              >
                {() => (
                  <Form>
                    <Field
                      type="text"
                      label="Nombre"
                      id="Name"
                      name="Name"
                      variant="outlined"
                      className="formElements"
                      as={TextField}
                    />
                    <div className="errorMessage">
                      <ErrorMessage name="Name" />
                    </div>
                    <Field
                      className="formElements"
                      type="text"
                      label="Apellido"
                      id="LastName"
                      name="LastName"
                      variant="outlined"
                      as={TextField}
                    />
                    <div className="errorMessage">
                      <ErrorMessage name="LastName" />
                    </div>
                    <Field
                      className="formElements"
                      type="date"
                      label="Fecha de nacimiento"
                      id="Date"
                      name="Date"
                      variant="outlined"
                      defaultValue={setTime}
                      inputProps={{ max: setTime() }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      as={TextField}
                    />
                    <div className="errorMessage">
                      <ErrorMessage name="Date" />
                    </div>
                    <Field
                      className="formElements"
                      type="text"
                      label="Cédula"
                      id="Id"
                      name="Id"
                      variant="outlined"
                      as={TextField}
                    />
                    <div className="errorMessage">
                      <ErrorMessage name="Id" />
                    </div>
                    <Field
                      className="formElements"
                      type="text"
                      label="Dirección particular"
                      id="Address"
                      name="Address"
                      variant="outlined"
                      as={TextField}
                    />
                    <div className="errorMessage">
                      <ErrorMessage name="Address" />
                    </div>
                    <div className="btnSubmitContainer">
                      <Button
                        className="btnSubmit"
                        {...styles.propsBtnSubmitAdd}
                      >
                        {' '}
                        Enviar{' '}
                      </Button>

                      <Button
                        onClick={eventModalAdd}
                        {...styles.propsBtnSubmitCancel}
                      >
                        {' '}
                        Cancelar{' '}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          }
        </Modal>

        <Modal open={modalEdit} onClose={eventModalEdit}>
          {
            <div className="formContentModal">
              <Formik
                initialValues={{ ...person }}
                validationSchema={personSchema}
                onSubmit={(values) => {
                  eventSubmitEdit(values)
                }}
              >
                {() => (
                  <Form>
                    <Field
                      className="formElements"
                      type="text"
                      label="Nombre"
                      id="Name"
                      name="Name"
                      variant="outlined"
                      as={TextField}
                    />
                    <div className="errorMessage">
                      <ErrorMessage name="Name" />
                    </div>
                    <Field
                      className="formElements"
                      type="text"
                      label="Apellido"
                      id="LastName"
                      name="LastName"
                      variant="outlined"
                      as={TextField}
                    />
                    <div className="errorMessage">
                      <ErrorMessage name="LastName" />
                    </div>
                    <Field
                      className="formElements"
                      type="date"
                      label="Fecha de nacimiento"
                      id="Date"
                      name="Date"
                      variant="outlined"
                      defaultValue={setTime}
                      inputProps={{ max: setTime() }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      as={TextField}
                    />
                    <div className="errorMessage">
                      <ErrorMessage name="Date" />
                    </div>
                    <Field
                      className="formElements"
                      type="text"
                      label="Cédula"
                      id="Id"
                      name="Id"
                      variant="outlined"
                      as={TextField}
                    />
                    <div className="errorMessage">
                      <ErrorMessage name="Id" />
                    </div>
                    <Field
                      className="formElements"
                      type="text"
                      label="Dirección particular"
                      id="Address"
                      name="Address"
                      variant="outlined"
                      as={TextField}
                    />
                    <div className="errorMessage">
                      <ErrorMessage name="Address" />
                    </div>
                    <div className="btnSubmitContainer">
                      <Button
                        className="btnSubmit"
                        {...styles.propsBtnSubmitEditPush}
                      >
                        {' '}
                        Editar{' '}
                      </Button>
                      <Button
                        {...styles.propsBtnSubmitEditCancel}
                        onClick={eventModalEdit}
                      >
                        {' '}
                        Cancelar{' '}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          }
        </Modal>
        <Modal open={modalUser} onClose={eventModalUser}>
          {
            <div className="ModalLoginUser">
              <div className="containerModalUser">
                <Avatar src={user?.image} className="avatarModalUser" />
              </div>
              <div className="containerModalUserText">
                <br />
                <br />
                <Typography className="textUser">{user?.name}</Typography>
                <Typography>{user?.email}</Typography>
              </div>
            </div>
          }
        </Modal>
        <Dialog
          open={modalDelete}
          onClose={eventModalDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Eliminar elemento'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              El siguiente elemento se eliminara, seguro que quieres eliminar a{' '}
              {<b>{person.Name}</b>}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              {...styles.propsBtnConfirmDeleted}
              onClick={eventElementDelete}
            >
              Si
            </Button>
            <Button {...styles.propsBtnUnDeleted} onClick={eventModalDelete}>
              No
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullWidth={true}
          maxWidth={'lg'}
          open={modalView}
          onClose={eventModalView}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Vista de elemento'}
            <div className="btnDelete">
              <Button onClick={eventModalView}>
                <CloseIcon />
              </Button>
            </div>
          </DialogTitle>
          <DialogContent className="tableView">
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      {General.secondColumn[0]}{' '}
                    </TableCell>
                    <TableCell align="center">
                      {General.secondColumn[1]}{' '}
                    </TableCell>
                    <TableCell align="center">
                      {General.secondColumn[2]}{' '}
                    </TableCell>
                    <TableCell align="center">
                      {General.secondColumn[3]}{' '}
                    </TableCell>
                    <TableCell align="center">
                      {General.secondColumn[4]}{' '}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">{person.Name} </TableCell>
                    <TableCell align="center">{person.LastName} </TableCell>
                    <TableCell align="center">{person.Date} </TableCell>
                    <TableCell align="center">{person.Id} </TableCell>
                    <TableCell align="center">{person.Address} </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </div>
    </ClickAwayListener>
  )
}

export default ViewElements

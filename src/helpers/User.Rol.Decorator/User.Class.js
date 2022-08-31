import Person from '../../Ruter/Person'

class User {
  constructor() {
    this.rolUser = null
    this.acciones = null
    this.data = null
  }

  getAcciones(eventElementAccion, eventAccion) {
    switch (this.rolUser) {
      case 'Admin':
        this.userAccion(eventElementAccion, eventAccion)
        break
      case 'Invite':
        this.userAccionInveter(eventElementAccion, eventAccion)
        break
      case 'Creational':
        this.userAccion(eventElementAccion, eventAccion)
        break
      default:
        break
    }
    return this.acciones
  }
  userAdmin = async () => {
    this.userAccion()
    this.data = await Person().getPerson()
  }
  userAccion(eventElementAccion, eventAccion) {
    this.acciones = [
      {
        icon: 'assignmentIcon',
        tooltip: 'Ver elemento',
        onClick: (event, rowData) =>
          eventElementAccion(rowData, 'View', eventAccion),
      },
      {
        icon: 'edit',
        tooltip: 'Editar elemento',
        onClick: (event, rowData) =>
          eventElementAccion(rowData, 'Edit', eventAccion),
      },
      {
        icon: 'delete',
        tooltip: 'Eliminar elemento',
        onClick: (event, rowData) =>
          eventElementAccion(rowData, 'Deleted', eventAccion),
      },
    ]
  }
  userAccionInveter(eventElementAccion, eventAccion) {
    this.acciones = [
      {
        icon: 'assignmentIcon',
        tooltip: 'Ver elemento',
        onClick: (event, rowData) =>
          eventElementAccion(rowData, 'View', eventAccion),
      },
    ]
    return this.acciones
  }
  userAccionNew(eventElementAccion, eventAccion) {
    this.acciones = [{}]
    return this.acciones
  }
  userInvite = async () => {
    this.userAccionInveter()
  }
  getData = async () => {
    switch (UserInstance.rolUser) {
      case 'Admin':
        this.data = await Person().getPerson()
        break
      case 'Invite':
        this.data = await Person().getPerson()
        break
      case 'Creational':
        this.data = await Person().getPerson()
        break
      case 'New':
        this.data = []
      default:
        break
    }
    return this.data
  }
  userSetAndGetPerson() {
    this.userAccion()
  }

  getRol(rol) {
    this.rolUser = rol

    switch (rol) {
      case 'Admin':
        this.userAdmin()
        break
      case 'Invite':
        this.userInvite()
        break
      case 'Creational':
        this.userSetAndGetPerson()
        break
      default:
        break
    }
  }
}
const UserInstance = new User()

export default UserInstance

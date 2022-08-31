import * as yup from 'yup'

const FIRST_REQ = 'Ingresar nombre.'

const UserSchema = yup.object().shape({
  Name: yup.string().required(FIRST_REQ),
  Rol: '',
})

export default UserSchema

import * as yup from "yup";
const MIN = 5;
const MAX = 15;
const FIRST_REQ = "Correo invalido.";
const SECOND_REQ = "Ingresar correo electrónico";
const THIRD_REQ = `El número de digitos permitido es ${MIN} hasta ${MAX}`;
const FOURTH_REQ = "Ingresar contraseña.";

const Account = {
  email: "",
  password: "",
};
export const accountSchema = yup.object().shape({
  email: yup.string().email(FIRST_REQ).required(SECOND_REQ),
  password: yup
    .string()
    .min(MIN, THIRD_REQ)
    .max(MAX, THIRD_REQ)
    .required(FOURTH_REQ),
}); 
export default Account;

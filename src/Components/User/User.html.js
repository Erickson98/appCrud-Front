import {
  Typography,
  Button,
  Modal,
  Paper,
  Card,
  DialogActions,
  DialogContentText,
  DialogContent,
  Dialog,
  DialogTitle,
  TextField,
  Avatar,
  MenuItem,
} from "@material-ui/core";
import GroupIcon from "@material-ui/icons/Group";
import MaterialTable from "material-table";
import { General } from "./user.props.materialTable";
import { Styles } from "./User.propsMaterialUi";
import { useEffect, useState, useContext } from "react";
import { useControlEvent, useEntite, useEntiteUser } from "./User.event";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./User.styles.css";
import UserEntity from "../Entities/User.entity";
import UserSchema from "../Entities/UserSchema.entity";
import { Account, confirmedAdmin } from "../../Ruter/Account";
import { useNavigate } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import userList from "../Entities/UserList";

import { SocketContext } from "../Entities/socket.io";

const User = (props) => {
  const socket = useContext(SocketContext);
  const styles = Styles();
  let [
    dataUser,
    modalEdit,
    modalDelete,
    modalUser,
    eventModalEdit,
    eventModalDelete,
    eventModalUser,
    eventSubmitEditRol,
    eventGetElementUser,
    eventElementDeleteUser,
    eventElementAccionUser,
  ] = useControlEvent();
  const [User, eventUpdateUser] = useEntite();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currency, setCurrency] = useState();
  const [user, eventUpdateEditUser] = useEntiteUser();
  const navigate = useNavigate();

  const handleChangeMenu = (event) => {
    setCurrency(event.target.value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(false);
  };

  const handleRoles = (values, currency) => {
    eventSubmitEditRol(values, currency);

    const list = userList[0].filter((x) => x.username == values.Name);
    socket.emit("changeRole", { nameUser: values.Name, idUser: list });
    socket.emit("updateOnViewElement", { nameUser: values.Name, idUser: list });
  };
  const handleDeletedUser = () => {
    eventElementDeleteUser();
    const list = userList[0].filter((x) => x.username == User.Name);
    socket.emit("deleteUser", { nameUser: User.Name, idUser: list });
  };

  useEffect(() => {
    eventGetElementUser();
    async function getData() {
      const element = await Account();

      eventUpdateEditUser(element.user);
    }
    getData();
  }, []);

  useEffect(() => {
    socket.on("UserList", () => {
      setTimeout(() => {
        eventGetElementUser();
      }, 1000);
    });

    socket.on("newRole", () => {
      async function checkAdmin() {
        setTimeout(async () => {
          const element = await Account();
          await confirmedAdmin();

          if (element.msg !== "success") {
            props.admin(false);
          }
        }, 1000);
      }

      checkAdmin();
    });
  }, [socket]);
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="mainContent">
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={0} square>
            <Card className="containerIcon">
              <Card className="carTwo">
                <GroupIcon className="iconProps"></GroupIcon>
              </Card>

              <Typography className="txtElement">Usuarios</Typography>

              <div className="addPerson">
                <ClickAwayListener onClickAway={handleClickAway}>
                  <div>
                    {anchorEl && (
                      <div>
                        <Paper className="cardDropDownMenu">
                          <div className="containerDropDownMenu">
                            <div className="imgDropDown">
                              {" "}
                              <Avatar src={user.image} />{" "}
                            </div>

                            <div className="textName">{user.name}</div>
                            <div className="textEmail">{user.email}</div>

                            <hr />
                            <div className="closeSession">
                              <Button
                                fullWidth={true}
                                onClick={() => {
                                  navigate("/ViewElement");
                                }}
                              >
                                Regresar
                              </Button>
                            </div>
                          </div>
                        </Paper>
                      </div>
                    )}
                    <Button className="btnUserGoogle" onClick={handleClick}>
                      <Avatar src={user.image} />
                    </Button>
                  </div>
                </ClickAwayListener>
              </div>
            </Card>
          </Paper>
        </ClickAwayListener>

        <MaterialTable
          columns={General.firstColumn}
          data={dataUser.filter(
            (x) => x.Identificator !== process.env.REACT_APP_API_ROL_ADMIN_USER
          )}
          title={""}
          actions={[
            {
              icon: "edit",
              tooltip: "Editar elemento",
              onClick: (event, rowData) =>
                eventElementAccionUser(rowData, "Edit", eventUpdateUser),
            },
            {
              icon: "delete",
              tooltip: "Eliminar elemento",
              onClick: (event, rowData) =>
                eventElementAccionUser(rowData, "Deleted", eventUpdateUser),
            },
          ]}
          options={{ actionsColumnIndex: 3 }}
          localization={{
            header: {
              actions: "Acciones",
            },
          }}
        />

        <Modal open={modalEdit} onClose={eventModalEdit}>
          {
            <div className="formContentModal">
              <Formik
                initialValues={{ ...User }}
                validationSchema={UserSchema}
                onSubmit={(values) => {
                  handleRoles(values, currency);
                }}
              >
                {() => (
                  <Form>
                    <Field
                      disabled
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

                    <FormControl className={"formElements"}>
                      <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                      <Select
                        labelId="Rol"
                        id="Rol"
                        name="Rol"
                        defaultValue={User.Rol}
                        onChange={handleChangeMenu}
                      >
                        <MenuItem value={"Admin"}>Admin</MenuItem>
                        <MenuItem value={"Invite"}>Invitado</MenuItem>
                        <MenuItem value={"Creational"}>Creacional</MenuItem>
                        <MenuItem value={"New"}>Nuevo</MenuItem>
                      </Select>
                    </FormControl>
                    <div className="errorMessage">
                      <ErrorMessage name="Rol" />
                    </div>

                    <div className="btnSubmitContainer">
                      <Button
                        className="btnSubmit"
                        {...styles.propsBtnSubmitEditPush}
                      >
                        {" "}
                        Editar{" "}
                      </Button>
                      <Button
                        {...styles.propsBtnSubmitEditCancel}
                        onClick={eventModalEdit}
                      >
                        {" "}
                        Cancelar{" "}
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
                <Avatar src={user.image} className="avatarModalUser" />
              </div>
              <div className="containerModalUserText">
                <br />
                <br />
                <Typography className="textUser">{UserEntity.Name}</Typography>
                <Typography>{UserEntity.Identificator}</Typography>
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
            {"Eliminar elemento"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              El siguiente elemento se eliminara, seguro que quieres eliminar a{" "}
              {<b>{User.Name}</b>}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              {...styles.propsBtnConfirmDeleted}
              onClick={handleDeletedUser}
            >
              Si
            </Button>
            <Button {...styles.propsBtnUnDeleted} onClick={eventModalDelete}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ClickAwayListener>
  );
};

export default User;

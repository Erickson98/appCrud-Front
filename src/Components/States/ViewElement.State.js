import { useState } from "react";
import getUser from "../../Ruter/GetUser";
import Person from "../../Ruter/Person";
import UserRouter from "../../Ruter/UserRouter";
import UserEntity from "../Entities/User.entity";
import { ObserverData } from "../../helpers/Update.data.DDBB.js/ObserverData";
import { SubjectCollection } from "../../helpers/Update.data.DDBB.js/SubjectData";
import UserInstance from "../../helpers/User.Rol.Decorator/User.Class";

export const useControlEvent = () => {
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [modalUser, setModalUser] = useState(false);
  const [id, setId] = useState(Number);
  const [data, setData] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const observer = new ObserverData();
  const subject = new SubjectCollection();
  subject.subscribe(observer);
  observer.setSubject(subject);

  const eventModalAdd = () => {
    setModalAdd(!modalAdd);
  };
  const eventModalEdit = () => {
    setModalEdit(!modalEdit);
  };
  const eventModalDelete = () => {
    setModalDelete(!modalDelete);
  };
  const eventModalView = () => {
    setModalView(!modalView);
  };
  const eventModalUser = () => {
    setModalUser(!modalUser);
  };
  const eventGetElement = async () => {
    await getUser();
    UserInstance.getRol(UserEntity.Rol);
    const sd = await UserInstance.getData();

    setData(sd);
  };
  const eventGetElementUser = async () => {
    await getUser();
    UserInstance.getRol(UserEntity.Rol);
    const s = await UserRouter().get();
    setDataUser(s.Users);
  };
  const eventSubmitAdd = async (values) => {
    eventModalAdd();
    const newPerson = await Person().createPerson(values);
    subject.setData(newPerson.data);
    subject.notify();
    const ss = await observer.update();
    setData(ss);
  };
  const eventSubmitEdit = async (values) => {
    delete values._id;
    await Person().updatePerson(values, id);
    eventModalEdit();
    const sd = await Person().getPerson();
    setData(sd);
  };
  const eventSubmitEditRol = async (values, currency) => {
    eventModalEdit();
    await UserRouter().put(values, values._id, currency);
  };
  const eventElementDelete = async () => {
    eventModalDelete();
    await Person().deletePerson(id);
    const sd = await Person().getPerson();
    setData(sd);
  };
  const eventElementAccion = (element, condition, entitie) => {
    setId(element._id);
    entitie(element);
    condition === "Edit"
      ? eventModalEdit()
      : condition === "Deleted"
      ? eventModalDelete()
      : eventModalView();
  };
  const eventElementAccionUser = (element, condition, entitie) => {
    entitie(element);
    condition === "Edit"
      ? eventModalEdit()
      : condition === "Deleted"
      ? eventModalDelete()
      : eventModalView();
  };

  return [
    data,
    dataUser,
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
    eventSubmitEditRol,
    eventGetElement,
    eventGetElementUser,
    eventElementAccion,
    eventElementDelete,
    eventElementAccionUser,
  ];
};

export const useEntite = () => {
  const [person, setPerson] = useState({
    name: "",
    LastName: "",
    Date: "",
    Id: "",
    Address: "",
  });
  const [User, setUser] = useState({
    name: "",
    Rol: "",
  });
  const eventUpdateUser = (element) => {
    setUser(element);
  };
  const eventUpdateEdit = (element) => {
    setPerson(element);
  };

  return [person, User, eventUpdateEdit, eventUpdateUser];
};

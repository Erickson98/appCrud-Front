import "./index.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Login from "./Components/Login/Login.html";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ViewElements from "./Components/ViewElement/ViewElement.html";
import { StylesProvider } from "@material-ui/core/styles";
import User from "./Components/User/User.html";
import { SocketContext, socket } from "./Components/Entities/socket.io";
const App = () => {
  const [autentication, setAutentication] = useState(false);
  const [admin, setAdmin] = useState(false);
  const handleAutentication = (value) => {
    setAutentication(value);
  };
  let miStorage = window.localStorage;

  const handleAdmin = (value) => {
    setAdmin(value);
  };

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to={"/Login"} />} />
          <Route
            path="/Login"
            element={
              autentication ? (
                <Navigate to={"/ViewElement"} />
              ) : (
                <Login admi={admin} autentication={handleAutentication} />
              )
            }
          />
          <Route
            path="/ViewElement"
            element={
              miStorage.getItem("autori") === "enable" ? (
                <ViewElements
                  admin={handleAdmin}
                  autentication={handleAutentication}
                />
              ) : (
                <Navigate to={"/Login"} />
              )
            }
          />
          <Route
            path="/User/Admin"
            element={
              miStorage.getItem("admin") === "enable" || admin ? (
                <User admin={handleAdmin} />
              ) : (
                <Navigate to={"/Login"} />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <StylesProvider injectFirst>
    <SocketContext.Provider value={socket}>
      <App />
    </SocketContext.Provider>
  </StylesProvider>,

  document.getElementById("root")
);

import { Grid, Typography, CardContent, Button } from "@material-ui/core";
import React, { useContext } from "react";
import Card from "@material-ui/core/Card";
import "./Login.styles.css";
import { succesLoginGoogle } from "../Auth/Google.auth";
import { succesLoginGithub } from "../Auth/Github.auth";
import { useEffect } from "react";
import { confirmedCredentials } from "../../Ruter/Account";
import {
  GoogleLoginButton,
  GithubLoginButton,
} from "react-social-login-buttons";

import { SocketContext } from "../Entities/socket.io";

const Login = (props) => {
  const socket = useContext(SocketContext);
  useEffect(() => {
    async function getAutentication() {
      const enable = await confirmedCredentials();
      console.log(enable);
      if (enable.newUser === "enable" && enable.msg === "success") {
        socket.emit("getNewUser");
      }

      return enable.msg !== "success"
        ? props.autentication(true)
        : "no autenticated";
    }
    getAutentication();
  }, []);
  return (
    <Grid className="container" container>
      <Card className="card">
        <CardContent className="cardContainer">
          <Typography variant="h4" color="initial" className="txtSignIn">
            Iniciar sesion
          </Typography>

          <div className="divGoogle">
            <div>
              <GoogleLoginButton
                className="btnGithub"
                onClick={() => succesLoginGoogle(props)}
              />
            </div>
          </div>
          <Typography variant="h7" color="initial">
            O
          </Typography>
          <div className="divGithub">
            <div>
              <GithubLoginButton
                className="btnGithub"
                onClick={succesLoginGithub}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Login;

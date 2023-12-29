import React, { useEffect, useState, useContext } from "react";
import { Context } from "../Context/Context";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const { loggedUserObj, setLoggedUserObj } = useContext(Context);
  const { users, setUsers } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [serverErr, setServerErr] = useState("");
  const [disabledState, setDisabledState] = useState(false);

  useEffect(() => {
    (async function getAllUsers() {
      const response = await axios.get(process.env.REACT_APP_API_URL + "users");
      // console.log(response.data);
      setUsers(response.data);
    })();
  }, []);

  const handleLogin = async () => {
    try {
      if (!email) {
        setEmailErr("email field should be filled");
        return;
      } else if (!password) {
        setPasswordErr("password field should be filled");
        return;
      }
      setDisabledState(true);

      let newUser = {
        email: email,
        password: password,
      };

      // Логика проверки, заблокан ли юзер который пытается войти
      let currUser = users.filter((user) => user.email === newUser.email);
      // console.log("юзер который пытается войти: ", currUser);

      // добавил знак ?, если че надо убрать
      if (currUser[0]?.status === "blocked") {
        setServerErr("Sorry, your account has been blocked");
        setDisabledState(false);
        return;
      }

      const response = await axios.post(
        process.env.REACT_APP_API_URL + "login",
        newUser
      );
      setLoggedUserObj(newUser);
      localStorage.setItem("loggedObj", JSON.stringify(newUser));
      navigate("/");
    } catch (error) {
      if (error) {
        setServerErr(error.response.data.message);
        setDisabledState(false);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4">Sign in</h2>
          <div className="formValidError">{serverErr}</div>
          <div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Эл. адрес
              </label>
              <input
                className="form-control"
                disabled={disabledState}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailErr("");
                  setServerErr("");
                }}
                placeholder="login"
              />
              <div className="formValidError">{emailErr}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Пароль
              </label>
              <input
                className="form-control"
                disabled={disabledState}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordErr("");
                  setServerErr("");
                }}
                placeholder="password"
              />
              <div className="formValidError">{passwordErr}</div>
            </div>
            <button
              onClick={() => handleLogin()}
              disabled={disabledState}
              className="btn btn-primary"
            >
              Войти
            </button>{" "}
            <br />
            <br />
            <Link to="/register">create an account</Link> <br />
            {/* <Link to="/">home link</Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

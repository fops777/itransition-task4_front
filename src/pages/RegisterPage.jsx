import React, { useState } from "react";
import { useContext } from "react";
import { Context } from "../Context/Context";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loggedUserObj, setLoggedUserObj } = useContext(Context);
  const navigate = useNavigate();

  const [emailErr, setEmailErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [serverErr, setServerErr] = useState("");
  const [disabledState, setDisabledState] = useState(false);

  const handleRegister = async () => {
    try {
      if (!name) {
        setNameErr("Name field should be filled");
        return;
      } else if (!email) {
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
        name: name,
        status: "active",
        selected: false,
        lastTime: new Date().toLocaleString(),
      };
      // console.log(newUser.lastTime);
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "register",
        newUser
      );
      // console.log(response);
      setLoggedUserObj(newUser);
      localStorage.setItem("loggedObj", JSON.stringify(newUser));

      navigate("/");
    } catch (error) {
      if (error.response?.data[0]?.msg) {
        setServerErr(error.response?.data[0]?.msg);
        setDisabledState(false);
      } else if (error.response.data.message) {
        setServerErr(error.response.data.message);
        setDisabledState(false);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4">Sign up</h2>
          <div className="formValidError">{serverErr}</div>
          <div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Имя
              </label>
              <input
                className="form-control"
                disabled={disabledState}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameErr("");
                }}
                placeholder="name"
              />
              <div className="formValidError">{nameErr}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Эл. почта
              </label>
              <input
                className="form-control"
                disabled={disabledState}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailErr("");
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
                }}
                placeholder="password"
              />
              <div className="formValidError">{passwordErr}</div>
            </div>
            <button
              onClick={() => handleRegister()}
              disabled={disabledState}
              className="btn btn-primary"
            >
              Зарегистрироваться
            </button>
            <br />
            <br />
            <Link to="/login">log in</Link> <br />
            {/* <Link to="/">home link</Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context/Context";
import { useContext } from "react";
import UsersTable from "../components/UsersTable";
import axios from "axios";

function HomePage() {
  const { users, setUsers } = useContext(Context);
  const { loggedUserObj, setLoggedUserObj } = useContext(Context);
  const [currentUser, setCurrentUser] = useState();
  const [disabledState, setDisabledState] = useState(false);

  const navigate = useNavigate();

  let loggedUserFromLocal = JSON.parse(localStorage.getItem("loggedObj"));

  async function fetchUsers() {
    (async function getAllUsers() {
      setDisabledState(true);

      const response = await axios.get("http://localhost:4444/users");
      setUsers(response.data);
      setDisabledState(false);
    })();
  }

  useEffect(() => {
    fetchUsers();
    setLoggedUserObj(loggedUserFromLocal);
  }, []);

  const onSignOutClick = () => {
    localStorage.clear("loggedObj"); // было .setItem("loggedObj", "")
    setLoggedUserObj(); // было setLoggedUserObj("")
  };

  const onDeleteUsers = async () => {
    try {
      setDisabledState(true);
      let _loggedUserFromLocal = JSON.parse(localStorage.getItem("loggedObj"));
      let _loggedEmailFromLocal = _loggedUserFromLocal.email;

      let idsToDel = [];
      users.forEach((user) => {
        if (user.selected === true) {
          idsToDel.push(user._id);
        }
      });
      await axios.delete("http://localhost:4444/users", {
        data: { ids: idsToDel },
      });
      fetchUsers();

      // Логика вылета из главной страницы
      // 1) Найти и положить в новый массив всех юзеров у кого такие же id что и в idsToUpdate
      const foundUsersByIds = users.filter((user) =>
        idsToDel.includes(user._id)
      );
      // console.log(foundUsersByIds);
      // 2) Если email юзера из localstorate совпадает хоть с одним имейлом из нового
      // массива, то выполнить функцию logout()
      const isEmailMatching = foundUsersByIds.some(
        (user) => user.email === _loggedEmailFromLocal
      );
      if (isEmailMatching) {
        onSignOutClick();
      }
    } catch (error) {
      console.error("Ошибка при удалении пользователей:", error);
    }
  };

  const onBlockUser = async () => {
    try {
      setDisabledState(true);
      let _loggedUserFromLocal = JSON.parse(localStorage.getItem("loggedObj"));
      let _loggedEmailFromLocal = _loggedUserFromLocal.email;
      // console.log(_loggedEmailFromLocal);

      let idsToUpdate = [];
      users.forEach((user) => {
        if (user.selected === true) {
          idsToUpdate.push(user._id);
        }
      });

      await axios.patch("http://localhost:4444/block", {
        data: { ids: idsToUpdate },
      });
      fetchUsers();

      // Логика вылета из главной страницы
      // 1) Найти и положить в новый массив всех юзеров у кого такие же id что и в idsToUpdate
      const foundUsersByIds = users.filter((user) =>
        idsToUpdate.includes(user._id)
      );
      // console.log(foundUsersByIds);
      // 2) Если email юзера из localstorate совпадает хоть с одним имейлом из нового
      // массива, то выполнить функцию logout()
      const isEmailMatching = foundUsersByIds.some(
        (user) => user.email === _loggedEmailFromLocal
      );
      if (isEmailMatching) {
        onSignOutClick();
      }
    } catch (error) {
      console.error("Ошибка при блокировании пользователей:", error);
    }
  };

  const onUnlockUser = async () => {
    try {
      setDisabledState(true);
      let idsToUpdate = [];
      users.forEach((user) => {
        if (user.selected === true) {
          idsToUpdate.push(user._id);
        }
      });

      await axios.patch("http://localhost:4444/unlock", {
        data: { ids: idsToUpdate },
      });
      fetchUsers();
      // Нужно написать
      // Если блокируется юзер который находится в localstorate, то вызвать функцию onSignOutClick()
    } catch (error) {
      console.error("Ошибка при блокировании пользователей:", error);
    }
  };

  // Если !loggedUserFromLocal то redirect на страницу login
  useEffect(() => {
    if (!loggedUserFromLocal) {
      navigate("/login");
    }
  }, [loggedUserObj]);

  useEffect(() => {
    setCurrentUser(
      users.find((user) => user.email == loggedUserFromLocal?.email)
    );
  });

  return (
    <div className="">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand fs-3">iT</a>
          <div className="d-flex align-items-center">
            <div className="fs-5 me-2">Welcome, {currentUser?.name + "!"}</div>
            <button
              onClick={() => onSignOutClick()}
              className="btn btn-link fs-5"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="d-flex gap-3">
          <button
            onClick={() => onBlockUser()}
            disabled={disabledState}
            type="button"
            className="btn btn-outline-dark my-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-lock"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
            </svg>
          </button>
          <button
            onClick={() => onUnlockUser()}
            disabled={disabledState}
            type="button"
            className="btn btn-outline-dark my-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-unlock"
              viewBox="0 0 16 16"
            >
              <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2M3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />
            </svg>
          </button>
          <button
            onClick={() => onDeleteUsers()}
            disabled={disabledState}
            className="btn btn-outline-danger my-3"
            type="button"
          >
            delete
          </button>
        </div>
        <UsersTable disabledState={disabledState} />
      </div>
    </div>
  );
}
export default HomePage;

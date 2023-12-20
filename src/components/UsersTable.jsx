import React, { useState, useEffect, useContext } from "react";
import { Context } from "../Context/Context";
import "../App.css";

function UsersTable({ disabledState }) {
  const { users, setUsers } = useContext(Context);

  function onSelectUserClick(id) {
    const updatedUsers = users.map((user) => {
      if (user._id === id) {
        return { ...user, selected: !user.selected }; // Обновляем флаг selected для выбранного пользователя
      }
      return user;
    });
    setUsers(updatedUsers);
  }

  function onSelectAll() {
    let updatedUsers;
    if (users.every((item) => item.selected == true)) {
      updatedUsers = users.map((user) => {
        return { ...user, selected: false }; // Обновляем флаг selected для выбранного пользователя
      });
      setUsers(updatedUsers);
    } else {
      updatedUsers = users.map((user) => {
        return { ...user, selected: true }; // Обновляем флаг selected для выбранного пользователя
      });
      setUsers(updatedUsers);
    }
  }

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const formattedDate = new Date(dateString)
      .toLocaleString("ru-RU", options)
      .replace(",", ",");
    return formattedDate;
  };

  return (
    <div
      className={"table-responsive " + (disabledState ? "opacity_custom" : "")}
    >
      <table className="table p-5 container-sm custom_table">
        <thead>
          <tr>
            <th>
              <input
                onChange={() => onSelectAll()}
                style={{ cursor: "pointer" }}
                disabled={disabledState}
                checked={
                  users.every((item) => item.selected === true) ? true : false
                }
                className="form-check-input shadow"
                type="checkbox"
              />
            </th>
            <th scope="col">
              <strong>Name</strong>
            </th>
            <th scope="col">
              <strong>Email</strong>
            </th>
            <th scope="col">
              <strong>Reg. date</strong>
            </th>
            <th scope="col">
              <strong>Last time </strong>
            </th>
            <th scope="col">
              <strong>Status</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          {users == "" ? (
            <p className="fetching_loading">loading...</p>
          ) : (
            users.map((user) => {
              return (
                <tr
                  style={{ cursor: "pointer" }}
                  key={user._id}
                  className={user.status === "blocked" ? "transparent" : ""}
                >
                  <th scope="row">
                    <input
                      disabled={disabledState}
                      checked={user.selected ? true : false}
                      onChange={() => onSelectUserClick(user._id)}
                      className="form-check-input shadow "
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />
                  </th>
                  <td
                    className={
                      user.status === "blocked"
                        ? "text-decoration-line-through opacity_custom"
                        : ""
                    }
                  >
                    {user.name}
                  </td>
                  <td
                    className={
                      user.status === "blocked"
                        ? "text-decoration-line-through opacity_custom"
                        : ""
                    }
                  >
                    {user.email}
                  </td>
                  <td
                    className={
                      user.status === "blocked"
                        ? "text-decoration-line-through opacity_custom"
                        : ""
                    }
                  >
                    {formatDate(user.createdAt)}
                  </td>
                  <td
                    className={
                      user.status === "blocked"
                        ? "text-decoration-line-through opacity_custom"
                        : ""
                    }
                  >
                    {user.lastTime}
                  </td>
                  <td>{user.status}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;

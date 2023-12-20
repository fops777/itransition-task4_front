import { createContext, useState } from "react";

export const Context = createContext();

const Provider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loggedUserObj, setLoggedUserObj] = useState();

  return (
    <Context.Provider
      value={{ users, setUsers, loggedUserObj, setLoggedUserObj }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;

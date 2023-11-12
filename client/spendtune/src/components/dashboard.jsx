import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./login";
import Register from "./register";
import Home from "./home";
import SyncPage from "./syncPage";
import { useCombinedStore } from "../Store";

function Dashboard(props) {

  const [tokenStore, setTokenStore] = useState(null);
  const loggedUser = useCombinedStore(state => state.logged);

  return (
    <div className="dashboard">
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/home"
          element={
            loggedUser ? (
              <Home
              tokenStore={tokenStore}
              setTokenStore={setTokenStore}
              />
              ) : (
                <Navigate replace to={"/"} />
                )
          }
        />
        <Route
          path="/sync"
          element={
            loggedUser ? (
              <SyncPage tokenStore={tokenStore} setTokenStore={setTokenStore} />
            ) : (
              <Navigate replace to={"/home"} />
            )
          }
        />
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
    </div>
  );
}

export default Dashboard;

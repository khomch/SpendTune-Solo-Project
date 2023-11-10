import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./login";
import Register from "./register";
import Home from "./home";
import SyncPage from "./syncPage";

function Dashboard(props) {
  const [tokenStore, setTokenStore] = useState(null);

  return (
    <div className="dashboard">
      <Routes>
        <Route path="/" element={<Login setLogged={props.setLogged} />} />
        <Route
          path="/register"
          element={<Register setLogged={props.setLogged} />}
        />
        <Route
          path="/home"
          element={
              <Home
              logged={props.logged}
              setLogged={props.setLogged}
              tokenStore={tokenStore}
              setTokenStore={setTokenStore}
            />
          }
        />
        <Route
          path="/sync"
          element={
            props.logged ? (
              <SyncPage tokenStore={tokenStore} setTokenStore={setTokenStore} />
            ) : (
              <Navigate replace to={"/home"} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default Dashboard;

import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./util/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { routes } from "./util/routes";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div className="App">
        <Routes>
          {routes(user).map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

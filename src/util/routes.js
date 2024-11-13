import React from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import ExpenseDashboard from "../components/ExpenseDashboard";
import GroupDashboard from "../components/GroupDashboard";
import LandingPage from "../components/LandingPage";
import { Navigate } from "react-router-dom";

export const routes = (user) => [
  {
    path: "/",
    element: user ? (
      <Navigate to="/expenseDashboard" />
    ) : (
      <Navigate to="/login" />
    ),
  },
  {
    path: "/login",
    element: user ? <Navigate to="/landingPage" /> : <Login />,
  },
  {
    path: "/register",
    element: user ? <Navigate to="/landingPage" /> : <Register />,
  },
  {
    path: "/expenseDashboard",
    element: user ? <ExpenseDashboard /> : <Navigate to="/login" />,
  },
  {
    path: "/groupDashboard",
    element: user ? <GroupDashboard /> : <Navigate to="/login" />,
  },
  {
    path: "/landingPage",
    element: user ? <LandingPage /> : <Navigate to="/login" />,
  },
];

import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <button
        className="btn btn-success"
        onClick={() => navigate("/expenseDashboard")}
      >
        Expenses
      </button>
    </div>
  );
}

export default LandingPage;

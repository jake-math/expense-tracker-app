import React, { useState, useEffect, useCallback } from "react";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  auth,
} from "../util/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ExpenseDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeGroup, setActiveGroup] = useState({});
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const fetchExpenses = useCallback(async () => {
    const expensesData = await getExpenses();

    const filteredExpenses = expensesData.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const isAfterStartDate = startDate
        ? expenseDate >= new Date(startDate).setHours(0, 0, 0, 0)
        : true;
      const isBeforeEndDate = endDate
        ? expenseDate <= new Date(endDate).setHours(23, 59, 59, 999)
        : true;
      const groupMatches =
        activeGroup && expense.groupId
          ? expense.groupId === activeGroup.id
          : true;
      return isAfterStartDate && isBeforeEndDate && groupMatches;
    });
    setExpenses(filteredExpenses);
  }, [startDate, endDate]);

  const fetchActiveGroup = useCallback(() => {
    const storedGroup = localStorage.getItem("activeGroup");
    if (storedGroup) {
      setActiveGroup(JSON.parse(storedGroup));
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchActiveGroup();
  }, [fetchExpenses, fetchActiveGroup]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const newExpense = {
      owner: auth.currentUser?.uid,
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      groupId: activeGroup.id,
    };
    await addExpense(newExpense);
    setDescription("");
    setAmount("");
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    fetchExpenses();
  };

  const handleEdit = (expense) => {
    setEditMode(expense.id);
    setEditDescription(expense.description);
    setEditAmount(expense.amount);
  };

  const handleUpdateExpense = async (id) => {
    const updatedExpense = {
      description: editDescription,
      amount: parseFloat(editAmount),
    };
    await updateExpense(id, updatedExpense);
    setEditMode(null);
    fetchExpenses();
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Expense Tracker Dashboard</h2>
      <form onSubmit={handleAddExpense} className="mt-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Amount"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary w-100">
            Add Expense
          </button>
        </div>
      </form>

      <br />

      <div>
        <h3 className="text-center">Filter Expenses</h3>
        <div className="mt-4">
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <br />

      <h3 className="text-center">Expenses</h3>
      <ul className="list-group">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {editMode === expense.id ? (
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control mr-2"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control mr-2"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={() => handleUpdateExpense(expense.id)}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary ml-2"
                  onClick={() => setEditMode(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center w-100">
                <span>
                  {expense.description} - ${expense.amount.toFixed(2)}
                </span>
                <div>
                  <button
                    className="btn btn-warning mr-2"
                    onClick={() => handleEdit(expense)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <br />
      <br />

      <h4 className="text-center">
        Current group: {activeGroup.name || "None"}
      </h4>
      <div className="text-center">
        <button
          className="btn btn-success"
          onClick={() => navigate("/groupDashboard")}
        >
          Change Group
        </button>
      </div>

      <br />
      <br />

      <div className="logout-button">
        <p>You are logged in as: {auth.currentUser?.displayName}</p>
        <button className="btn btn-danger" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default ExpenseDashboard;

import React, { useState, useEffect, useCallback } from "react";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  auth,
} from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
        ? expenseDate >= new Date(startDate)
        : true;
      const isBeforeEndDate = endDate ? expenseDate <= new Date(endDate) : true;
      return isAfterStartDate && isBeforeEndDate;
    });
    setExpenses(filteredExpenses);
  }, [startDate, endDate]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const newExpense = {
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
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
    <div className="mt-5">
      <h1 className="text-center">Expense Tracker Dashboard</h1>

      <div className="container">
        <form onSubmit={handleAddExpense} className="mb-4">
          <div className="form-row">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="col">
              <button type="submit" className="btn btn-primary">
                Add Expense
              </button>
            </div>
          </div>
        </form>

        <div>
          <h3>Filter Expenses</h3>
          <div className="form-row mb-4">
            <div className="col">
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col">
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <h3>Expenses</h3>
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

        <div className="mt-4">
          <p>You are logged in as: {auth.currentUser?.email}</p>
          <button className="btn btn-danger" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

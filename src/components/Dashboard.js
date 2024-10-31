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

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
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
        ? expenseDate >= new Date(startDate + "T00:00:00Z")
        : true;
      const isBeforeEndDate = endDate
        ? expenseDate <= new Date(endDate + "T23:59:59Z")
        : true;
      return isAfterStartDate && isBeforeEndDate;
    });
    setExpenses(filteredExpenses);
  }, [startDate, endDate]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!description || amount <= 0) {
      setMessage("Please provide a valid description and amount.");
      return;
    }
    const newExpense = {
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    };
    await addExpense(newExpense);
    setDescription("");
    setAmount("");
    setMessage("Expense added successfully!");
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    setMessage("Expense deleted successfully!");
    fetchExpenses();
  };

  const handleEdit = (expense) => {
    setEditMode(expense.id);
    setEditDescription(expense.description);
    setEditAmount(expense.amount);
  };

  const handleUpdateExpense = async (id) => {
    if (!editDescription || editAmount <= 0) {
      setMessage("Please provide a valid description and amount.");
      return;
    }
    const updatedExpense = {
      description: editDescription,
      amount: parseFloat(editAmount),
    };
    await updateExpense(id, updatedExpense);
    setEditMode(null);
    setMessage("Expense updated successfully!");
    fetchExpenses();
  };

  return (
    <div>
      <h1>Expense Tracker Dashboard</h1>

      {/* Display user feedback */}
      {message && <p>{message}</p>}

      <form onSubmit={handleAddExpense}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add Expense</button>
      </form>

      {/* Filter Inputs */}
      <div>
        <h3>Filter Expenses</h3>
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <h3>Expenses</h3>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {editMode === expense.id ? (
              <div>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
                <button onClick={() => handleUpdateExpense(expense.id)}>
                  Save
                </button>
                <button onClick={() => setEditMode(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {expense.description} - ${expense.amount.toFixed(2)}
                <button onClick={() => handleEdit(expense)}>Edit</button>
                <button onClick={() => handleDelete(expense.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div>
        <p>You are logged in as: {auth.currentUser?.email}</p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
}

export default Dashboard;

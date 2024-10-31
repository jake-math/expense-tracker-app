import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

console.log("API Key:", process.env);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "expensetrackerapp-92854.firebaseapp.com",
  projectId: "expensetrackerapp-92854",
  storageBucket: "expensetrackerapp-92854.appspot.com",
  messagingSenderId: "563331540616",
  appId: "1:563331540616:web:7714a779d888d2b769213d",
  measurementId: "G-GR5KSWW2D3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to local.");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export const addExpense = async (expense) => {
  try {
    await addDoc(collection(db, "expenses"), expense);
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};

export const getExpenses = async () => {
  const expenses = [];
  try {
    const querySnapshot = await getDocs(collection(db, "expenses"));
    querySnapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error("Error getting expenses:", error);
  }
  return expenses;
};

export const updateExpense = async (id, updatedData) => {
  try {
    const expenseDoc = doc(db, "expenses", id);
    await updateDoc(expenseDoc, updatedData);
  } catch (error) {
    console.error("Error updating expense: ", error);
  }
};

export const deleteExpense = async (id) => {
  try {
    await deleteDoc(doc(db, "expenses", id));
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
};

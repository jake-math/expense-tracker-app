import React, { useEffect, useState, useCallback } from "react";
import {
  addGroup,
  auth,
  deleteGroup,
  getGroups,
  getUser,
  updateUser,
} from "../util/firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function GroupDashboard() {
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState({});
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();

  const fetchGroups = useCallback(async () => {
    const groupsData = await getGroups();
    const filteredGroups = groupsData.filter((group) => {
      return auth && group.users
        ? group.users.includes(auth.currentUser?.uid)
        : true;
    });
    setGroups(filteredGroups);

    const storedGroup = localStorage.getItem("activeGroup");
    if (storedGroup) {
      setActiveGroup(JSON.parse(storedGroup));
    }
  }, []);

  const handleSetActive = useCallback(
    (id) => {
      const selectedGroup = groups.find((group) => group.id === id);
      setActiveGroup(selectedGroup);

      localStorage.setItem("activeGroup", JSON.stringify(selectedGroup));
      navigate("/expenseDashboard");
    },
    [groups]
  );

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleAddGroup = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    const newGroup = {
      owner: uid,
      name: groupName,
      users: [uid],
    };
    await addGroup(newGroup);

    const currentUser = await getUser(uid);
    const currentGroups = currentUser.groups;
    currentGroups.push(activeGroup.id);

    const updatedUser = {
      id: uid,
      email: currentUser.email,
      name: currentUser.name,
      groups: currentGroups,
    };

    await updateUser(uid, updatedUser);
    setGroupName("");
    fetchGroups();
  };

  const handleDelete = async (id) => {
    console.log(id);
    await deleteGroup(id);
    fetchGroups();
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Group Dashboard</h2>
      <form onSubmit={handleAddGroup} className="mt-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary w-100">
            Add Group
          </button>
        </div>
      </form>
      <br />
      <h3 className="text-center">Expenses</h3>
      <ul className="list-group">
        {groups.map((group) => (
          <li
            key={group.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <span>{group.name}</span>
              <div>
                {activeGroup.id === group.id ? (
                  <button className="btn btn-success" id="active">
                    Active
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    id="setActive"
                    onClick={() => handleSetActive(group.id)}
                  >
                    Set Active
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(group.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div class="mb-3">
        <br />
        <button
          type="submit"
          class="btn btn-primary"
          onClick={() => navigate("/expenseDashboard")}
        >
          To Expense Dashboard
        </button>
      </div>
    </div>
  );
}

export default GroupDashboard;

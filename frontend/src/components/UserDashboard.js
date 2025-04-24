import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProblemListUser from "./ProblemListUser";
import "../styles/UserDashboard.css";

const UserDashboard = ({ userId }) => {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
    fetchUserPreferences();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await fetch("https://leetcodeprojv2.onrender.com/admin/problems");
      const data = await res.json();
      setProblems(data);
    } catch (error) {
      console.error("❌ Error fetching problems:", error);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("https://leetcodeprojv2.onrender.com/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user profile");

      const data = await res.json();
      if (!data._id) throw new Error("User ID not found in response");

      setNotificationsEnabled(data.notificationsEnabled);
    } catch (error) {
      console.error("❌ Error fetching user preferences:", error);
    }
  };

  const handleToggleNotifications = async () => {
    try {
      const newStatus = !notificationsEnabled;
      setNotificationsEnabled(newStatus);

      await fetch(`https://leetcodeprojv2.onrender.com/auth/notifications/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationsEnabled: newStatus }),
      });
    } catch (error) {
      console.error("❌ Error updating notifications:", error);
    }
  };

  const filteredProblems = problems.filter((problem) =>
    problem.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="user-dashboard">
      <div className="wrap">
        <button className="logout-btn" onClick={() => navigate("/")}>
          Logout
        </button>
        <div className="pad"></div>
      </div>
      <h1>Problem Collection 📚</h1>

      <div className="toggle-container">
        <span>🔔 Notifications:</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={handleToggleNotifications}
          />
          <span className="slider"></span>
        </label>
      </div>

      <input
        type="text"
        placeholder="🔎 Search by problem name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <ProblemListUser problems={currentProblems} />

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          ⬅ Prev
        </button>
        <span>
          {" "}
          Page {currentPage} of {totalPages}{" "}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;

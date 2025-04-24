import React, { useState } from "react";
import "../styles/ProblemItem.css";

const ProblemItemUser = ({ problem }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="problem-item">
      <h3>{problem.name}</h3>
      <p>{problem.description}</p>
      <p>
        <strong>Category:</strong> {problem.category}
      </p>

      <div className="button-row">
        <div className="button-row">
          <button
            className="user-action-btn watch-btn"
            onClick={() => setShowVideo(true)}
          >
            📹 Watch Video
          </button>
          <a
            href={problem.codeUrl}
            download
            className="user-action-btn code-btn"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            ⬇ Download Code
          </a>
        </div>
      </div>

      {showVideo && (
        <div className="modal-overlay" onClick={() => setShowVideo(false)}>
          <div className="modal-backdrop" />
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="wrap">
              <button
                className="logout-btn"
                onClick={() => setShowVideo(false)}
              >
                Exit
              </button>
            <div className="pad"></div>
            <video
              src={problem.videoUrl}
              controls
              width="100%"
              style={{ borderRadius: "8px", marginTop: "12px" }}
            />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemItemUser;

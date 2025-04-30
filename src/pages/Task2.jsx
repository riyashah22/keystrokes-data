import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import "./Task.css";

function Task2() {
  const navigate = useNavigate();
  const [keystrokes, setKeystrokes] = useState([]);
  const [inputText, setInputText] = useState("");
  const keyDownTime = useRef({});
  const textareaRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleKeyDown = (e) => {
    const time = Date.now();
    keyDownTime.current[e.key] = time;
  };

  const handleKeyUp = (e) => {
    const time = Date.now();
    const pressTime = keyDownTime.current[e.key] || time;

    setKeystrokes((prev) => [
      ...prev,
      {
        key: e.key,
        pressTime,
        releaseTime: time,
      },
    ]);
  };

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async () => {
    const emailId = localStorage.getItem("emailId") || "unknown";
    if (inputText.length < 300) {
      setModalMessage("Please type at least 300 characters before submitting.");
      setShowModal(true);
      return;
    }

    // Convert keystrokes to CSV string
    const csvData =
      "emailId,press_time,release_time,key\n" +
      keystrokes
        .map((k) => `${emailId},${k.pressTime},${k.releaseTime},${k.key}`)
        .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const file = new File([blob], `keystrokes_${emailId}_${Date.now()}.csv`);

    const { data, error } = await supabase.storage
      .from("keystroke-data") // Make sure this bucket exists
      .upload(`noCheat/keystrokes_${emailId}_${Date.now()}.csv`, file);

    if (error) {
      setModalMessage("❌ Error uploading: " + error.message);
      setShowModal(true);
    } else {
      navigate("/gratitude");
    }

    setKeystrokes([]);
    setInputText("");
    if (textareaRef.current) textareaRef.current.value = "";
  };

  return (
    <div className="dashboard-container">
      <div className="activity-box">
        Be honest and type your answer in the box below.
      </div>
      <h2>
        What do you think makes a person truly successful? (atleast 300
        characters)
      </h2>
      <textarea
        ref={textareaRef}
        className="typing-box"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onChange={handleChange}
        value={inputText}
        placeholder="Start typing here..."
        rows={8}
        cols={50}
      ></textarea>
      <div>{inputText.length} characters</div>
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task2;

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import "./Task.css";

function Task1() {
  const navigate = useNavigate();
  const [keystrokes, setKeystrokes] = useState([]);
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

    let key = e.key;
    if (key === ",") {
      key = "o";
    }

    setKeystrokes((prev) => [
      ...prev,
      {
        key,
        pressTime,
        releaseTime: time,
      },
    ]);
  };

  const handleSubmit = async () => {
    const emailId = localStorage.getItem("emailId") || "unknown";

    const csvData =
      "emailId,press_time,release_time,key\n" +
      keystrokes
        .map((k) => `${emailId},${k.pressTime},${k.releaseTime},${k.key}`)
        .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const file = new File([blob], `keystrokes_${emailId}_${Date.now()}.csv`);

    const { data, error } = await supabase.storage
      .from("keystroke-data")
      .upload(`cheat/keystrokes_${emailId}_${Date.now()}.csv`, file);

    if (error) {
      setModalMessage("❌ Error uploading: " + error.message);
      setShowModal(true);
    } else {
      setModalMessage("✅ One more task to go! 🙌✨");
      setShowModal(true);
      setTimeout(() => {
        navigate("/task2");
      }, 1500);
    }

    setKeystrokes([]);
    if (textareaRef.current) textareaRef.current.value = "";
  };

  return (
    <div className="dashboard-container">
      <div>
        <div className="activity-box">
          This activity is designed to help us better understand user
          interaction patterns during text input. It supports research into
          improving typing-based assessments and user-centric design.
        </div>
        <div className="note">Note: Please don't directly copy and paste.</div>
      </div>
      <div className="company-name">Talview</div>
      <div className="paragraph-box">
        Talview specializes in revolutionizing organizational interview and exam
        processes through its GenAI technology, emphasizing integrity,
        efficiency and fairness. The platform employs advanced facial and voice
        recognition to ensure secure and non-intrusive remote interviewing and
        proctoring experiences.
      </div>
      <h2>Write the above paragraph 📝</h2>
      <textarea
        ref={textareaRef}
        className="typing-box"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder="Start typing here..."
        rows={8}
        cols={50}
      ></textarea>
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task1;

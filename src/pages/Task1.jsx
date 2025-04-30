import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import "./Task.css";

function Task1() {
  const navigate = useNavigate();
  const [keystrokes, setKeystrokes] = useState([]);
  const keyDownTime = useRef({});
  const textareaRef = useRef();

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

  const handleSubmit = async () => {
    const uid = localStorage.getItem("uid") || "unknown";

    const csvData =
      "uid,press_time,release_time,key\n" +
      keystrokes
        .map((k) => `${uid},${k.pressTime},${k.releaseTime},${k.key}`)
        .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const file = new File([blob], `keystrokes_${uid}_${Date.now()}.csv`);

    const { data, error } = await supabase.storage
      .from("keystroke-data")
      .upload(`cheat/keystrokes_${uid}_${Date.now()}.csv`, file);

    if (error) {
      alert("Error uploading: " + error.message);
    } else {
      alert("One more task to go! 🙌✨");
      navigate("/task2");
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
    </div>
  );
}

export default Task1;

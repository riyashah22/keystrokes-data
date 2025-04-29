import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import "./Dashboard.css";

function Dashboard2() {
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
    // Convert keystrokes to CSV string
    const csvData =
      "press_time,release_time,key\n" +
      keystrokes
        .map((k) => `${k.pressTime},${k.releaseTime},${k.key}`)
        .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const file = new File([blob], "keystrokes.csv");

    const { data, error } = await supabase.storage
      .from("keystroke-data") // Make sure this bucket exists
      .upload(`noCheat/keystrokes_${Date.now()}.csv`, file);

    if (error) {
      alert("Error uploading: " + error.message);
    } else {
      alert(
        "Thank you so much for your help 🙏✨\nYour support meant a lot. 😊💫"
      );
      navigate("/");
    }

    setKeystrokes([]);
    if (textareaRef.current) textareaRef.current.value = "";
  };

  return (
    <div className="dashboard-container">
      <h2>
        What do you think makes a person truly successful? (atleast 300
        characters)
      </h2>
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

export default Dashboard2;

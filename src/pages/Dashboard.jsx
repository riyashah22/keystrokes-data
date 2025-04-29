import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import "./Dashboard.css";

function Dashboard() {
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
      .upload(`cheat/keystrokes_${Date.now()}.csv`, file);

    if (error) {
      alert("Error uploading: " + error.message);
    } else {
      alert("One more task to go! 🙌✨");
      // print(data);
      navigate("/task2");
    }

    setKeystrokes([]);
    if (textareaRef.current) textareaRef.current.value = "";
  };

  return (
    <div className="dashboard-container">
      <div className="activity-box">
        This activity is designed to help us better understand user interaction
        patterns during text input. It supports research into improving
        typing-based assessments and user-centric design.
      </div>
      <div className="company-name">Talview</div>
      <div className="paragraph-box">
        Talview is a leading AI-powered talent assessment and remote proctoring
        company founded in 2013 by IIT Bombay alumni Sanjoe Tom Jose, Mani Ka,
        Tom Jose and Jobin Jose. Headquartered in San Mateo, California with
        offices in India and the UK. Talview serves clients in over 120
        countries. The platform offers automated video interviewing, secure
        remote proctoring and AI-driven workflows to streamline hiring and
        testing processes.The company is recognized for innovations like “Alvy”
        an AI proctoring agent powered by large language models, and adheres to
        global data security standards.
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

export default Dashboard;

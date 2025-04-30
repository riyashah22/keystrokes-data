import React from "react";
import "./Gratitude.css"; // Import the CSS file

function Gratitude() {
  return (
    <div className="gratitude-container">
      <div className="gratitude-box">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3159/3159066.png"
          alt="Thank You"
          className="gratitude-img"
        />
        <h1 className="gratitude-title">Thank You!</h1>
        <p className="gratitude-message">
          Thank you for your help 🙏✨ Your support meant a lot. 😊💫
        </p>
      </div>
    </div>
  );
}

export default Gratitude;

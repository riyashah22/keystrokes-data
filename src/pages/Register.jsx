import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    // Try to insert the user into the table
    const { data, error } = await supabase
      .from("users")
      .insert([{ email: email, name: name }]);

    if (error) {
      // Check if the error is a duplicate key error (email already exists)
      if (
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        setMessage("Error: User already exists. Please use a different email.");
      } else {
        setMessage("Error: " + error.message);
      }
      return;
    }

    // If no error, proceed to save email and navigate to the next page
    localStorage.setItem("emailId", email);
    navigate("/task1");

    // Reset form fields after successful registration
    setEmail("");
    setName("");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            required
          />
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Name"
            required
          />
          <button type="submit">Get Started</button>
        </form>
      </div>
    </div>
  );
}

export default Register;

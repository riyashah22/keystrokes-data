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

    const { _, error } = await supabase.auth.signUp({
      email: email,
      password: "Talview" + name,
    });

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password: "Talview" + name,
      });

    if (loginError) {
      setMessage("Login failed: " + loginError.message);
      return;
    }

    const uid = loginData.user.id;
    localStorage.setItem("uid", uid); // Store UID locally
    navigate("/task1");

    setEmail("");
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

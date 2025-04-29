import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Dashboard2 from "./pages/Dashboard2";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Register />}></Route>

        {/* Dashboard Page */}
        <Route path="/task1" element={<Dashboard />}></Route>
        <Route path="/task2" element={<Dashboard2 />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

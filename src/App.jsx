import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Register from "./pages/Register";
import Task1 from "./pages/Task1";
import Task2 from "./pages/Task2";
import Gratitude from "./pages/Gratitude";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Register />}></Route>

        {/* Dashboard Page */}
        <Route path="/task1" element={<Task1 />}></Route>
        <Route path="/task2" element={<Task2 />}></Route>
        <Route path="/thank-you" element={<Gratitude />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;

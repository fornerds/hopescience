import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { SignIn, NaverSignIn } from "./pages/SignIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signin/naver/callback" element={<NaverSignIn />} />
      </Routes>
    </Router>
  );
}

export default App;

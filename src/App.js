import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { SignIn, NaverSignIn } from "./pages/SignIn";
import { Courses } from "./pages/Courses";
import { Course } from "./pages/Courses/[course_id]";
import { Cart } from "./pages/Cart/[user_id]/[course_id]";
import { SuccessPage } from "./pages/Cart/[user_id]/[course_id]/Success";
import { FailPage } from "./pages/Cart/[user_id]/[course_id]/Fail";
import { Policy } from "./pages/Policy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signin/naver/callback" element={<NaverSignIn />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:course_id" element={<Course />} />
        <Route path="/cart/:user_id/:course_id" element={<Cart />} />
        <Route path="/cart/:user_id/:course_id/success" element={<SuccessPage />} />          
        <Route path="/cart/:user_id/:course_id/fail" element={<FailPage />} />
      </Routes>
    </Router>
  );
}

export default App;

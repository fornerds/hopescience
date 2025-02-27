import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { SignIn, NaverSignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Courses } from "./pages/Courses";
import { Course } from "./pages/Courses/[course_id]";
import { Cart } from "./pages/Cart/[user_id]/[course_id]";
import { SuccessPage } from "./pages/Cart/[user_id]/[course_id]/Success";
import { FailPage } from "./pages/Cart/[user_id]/[course_id]/Fail";
import { Policy } from "./pages/Policy";
import { Lecture } from "./pages/Courses/[course_id]/[lecture_id]";
import { LectureInquiry } from "./pages/Courses/[course_id]/[lecture_id]/[course_inquiry_id]";
import { LectureInquiryEdit } from "./pages/Courses/[course_id]/[lecture_id]/[course_inquiry_id]/Edit";
import { NewLectureInquiry } from "./pages/Courses/[course_id]/[lecture_id]/New";
import { QnA } from "./pages/QnA";
import { QnADetail } from "./pages/QnA/[inquiry_id]";
import { QnAEdit } from "./pages/QnA/[inquiry_id]/Edit";
import { NewQnAInquiry } from "./pages/QnA/New";
import { MyPage } from "./pages/MyPage/Courses";
import { Orders } from "./pages/MyPage/Orders";
import { Order } from "./pages/MyPage/Orders/[payment_id]";
import { Setting } from "./pages/MyPage/Setting";
import { Certificates } from "./pages/MyPage/Certificates";
import { Certificate } from "./pages/MyPage/Certificates/[certificate_id]";
import { Admin } from "./pages/Admin";
import { Users } from "./pages/Admin/Users";
import { User } from "./pages/Admin/Users/[user_id]";
import { AdminQnA } from "./pages/Admin/AdminQnA";
import { NewAdminQnAInquiry } from "./pages/Admin/AdminQnA/New";
import { AdminQnADetail } from "./pages/Admin/AdminQnA/[inquiry_id]";
import { Service } from "./pages/Admin/Service";
import { NewService } from "./pages/Admin/Service/New";
import { ServiceEdit } from "./pages/Admin/Service/[course_id]";
import { AdminOrders } from "./pages/Admin/AdminOrders";
import { AdminOrder } from "./pages/Admin/AdminOrders/[payment_id]";
import { AdminCategoryDetail } from "./pages/Admin/Category/[category_name]/[course_inquiry_id]";
import { AdminCounselingDetail } from "./pages/Admin/Counseling/[counseling_id]";
import { FindPassword } from "./pages/FindPassword";
import { ResetPassword } from "./pages/ResetPassword";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/findpassword" element={<FindPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signin/naver/callback" element={<NaverSignIn />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:course_id" element={<Course />} />
        <Route path="/cart/:user_id/:course_id" element={<Cart />} />
        <Route
          path="/cart/:user_id/:course_id/success"
          element={<SuccessPage />}
        />
        <Route path="/cart/:user_id/:course_id/fail" element={<FailPage />} />
        <Route path="/courses/:course_id/:lecture_id" element={<Lecture />} />
        <Route
          path="/courses/:course_id/:lecture_id/:course_inquiry_id"
          element={<LectureInquiry />}
        />
        <Route
          path="/courses/:course_id/:lecture_id/:course_inquiry_id/edit"
          element={<LectureInquiryEdit />}
        />
        <Route
          path="/courses/:course_id/:lecture_id/new"
          element={<NewLectureInquiry />}
        />
        <Route path="/QnA" element={<QnA />} />
        <Route path="/QnA/:inquiry_id" element={<QnADetail />} />
        <Route path="/QnA/:inquiry_id/edit" element={<QnAEdit />} />
        <Route path="/QnA/new" element={<NewQnAInquiry />} />
        <Route path="/mypage/courses" element={<MyPage />} />
        <Route path="/mypage/orders" element={<Orders />} />
        <Route path="/mypage/orders/:payment_id" element={<Order />} />
        <Route path="/mypage/setting" element={<Setting />} />
        <Route path="/mypage/certificates" element={<Certificates />} />
        <Route
          path="/mypage/certificates/:certificate_id"
          element={<Certificate />}
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/users/:user_id" element={<User />} />
        <Route path="/admin/QnA" element={<AdminQnA />} />
        <Route path="/admin/QnA/:inquiry_id" element={<AdminQnADetail />} />
        <Route path="/admin/QnA/new" element={<NewAdminQnAInquiry />} />
        <Route
          path="/admin/Category/:category_name/:course_inquiry_id"
          element={<AdminCategoryDetail />}
        />
        <Route
          path="/admin/Counseling/:counseling_id"
          element={<AdminCounselingDetail />}
        />
        <Route path="/admin/service" element={<Service />} />
        <Route path="/admin/service/new" element={<NewService />} />
        <Route path="/admin/service/:course_id" element={<ServiceEdit />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:order_id" element={<AdminOrder />} />
      </Routes>
    </Router>
  );
}

export default App;

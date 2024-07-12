import { AdminSideBar } from "../../../../../modules/AdminSideBar";
import { AdminPost } from "../../../../../modules/Post";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const AdminCategoryDetail = () => {
  const navigate = useNavigate();
  const myUserType = useMemo(() => {
    const data = sessionStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userType : null;
  }, []);

  useEffect(()=>{
    if(myUserType !== "admin"){
      alert("관리자 계정으로 로그인해주세요.")
      navigate("/admin")
    }
  }, [])

  return (
    <>
      <div className="admin-background">
        <div className="layout-flex">
          <AdminSideBar />
          <main className="admin-main-content">
            <h2 className="admin-page-title">게시글관리</h2>
            <AdminPost />
          </main>
        </div>
      </div>
    </>
  );
};

import { AdminSideBar } from "../../../modules/AdminSideBar";
import { ServicePagination } from "../../../modules/ServicePagination";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const Service = () => {
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
            <h2 className="admin-page-title">서비스관리</h2>
            <ServicePagination />
          </main>
        </div>
      </div>
    </>
  );
};

import { AdminSideBar } from "../../../../modules/AdminSideBar";
import { AdminReceiptPdfGenerator } from "../../../../modules/PdfGenerator/PdfGenerator";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const AdminOrder = () => {
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
            <h2 className="admin-page-title">결제정보</h2>
            <AdminReceiptPdfGenerator />
          </main>
        </div>
      </div>
    </>
  );
};

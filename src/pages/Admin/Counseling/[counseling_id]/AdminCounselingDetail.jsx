import { AdminSideBar } from "../../../../modules/AdminSideBar";
import { AdminCounseling } from "../../../../modules/Post";

export const AdminCounselingDetail = () => {
  return (
    <>
      <div className="admin-background">
        <div className="layout-flex">
          <AdminSideBar />
          <main className="admin-main-content">
            <h2 className="admin-page-title">게시글관리</h2>
            <AdminCounseling />
          </main>
        </div>
      </div>
    </>
  );
};

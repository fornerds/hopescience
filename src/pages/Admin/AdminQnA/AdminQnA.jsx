import { AdminSideBar } from "../../../modules/AdminSideBar";
import { QnAPagination } from "../../../modules/QnAPagination";

export const AdminQnA = () => {
  return (
    <>
      <div className="admin-background">
        <div className="layout-flex">
          <AdminSideBar />
          <main className="admin-main-content">
            <h2 className="admin-page-title">게시글관리</h2>
            <QnAPagination />
          </main>
        </div>
      </div>
    </>
  );
};

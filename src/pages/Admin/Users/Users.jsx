import { AdminSideBar } from "../../../modules/AdminSideBar/AdminSideBar";
import { UsersPagination } from "../../../modules/UsersPagination/UsersPagination";
import "./Users.css";

export const Users = () => {
  return (
    <>
      <div className="admin-background">
        <div className="layout-flex">
          <AdminSideBar />
          <main className="admin-main-content">
            <h2 className="admin-page-title">회원관리</h2>
            <UsersPagination />
          </main>
        </div>
      </div>
    </>
  );
};

import { AdminSideBar } from "../../../../modules/AdminSideBar";
import { UserProfile } from "../../../../modules/UserProfile";
import { UserPagination } from "../../../../modules/UserPagination";

export const User = () => {
  return (
    <>
      <div className="admin-background">
        <div className="layout-flex">
          <AdminSideBar />
          <main className="admin-main-content">
            <h2 className="admin-page-title">회원관리</h2>
            <UserProfile />
            <UserPagination />
          </main>
        </div>
      </div>
    </>
  );
};

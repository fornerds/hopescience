import { AdminSideBar } from "../../../../modules/AdminSideBar";
import { Post } from "../../../../modules/Post";

export const AdminQnADetail = () => {
  return (
    <>
      <div className="admin-background">
        <div className="layout-flex">
          <AdminSideBar />
          <main className="admin-main-content">
            <h2 className="admin-page-title">게시글관리</h2>
            <Post />
          </main>
        </div>
      </div>
    </>
  );
};

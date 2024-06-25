import { AdminSideBar } from "../../../../modules/AdminSideBar";
import { PostEditor } from "../../../../modules/PostEditor/PostEditor";

export const NewAdminQnAInquiry = () => {
  return (
    <>
      <div className="admin-background">
        <div className="layout-flex">
          <AdminSideBar />
          <main className="admin-main-content">
            <h2 className="admin-page-title">게시글관리</h2>
            <PostEditor />
          </main>
        </div>
      </div>
    </>
  );
};

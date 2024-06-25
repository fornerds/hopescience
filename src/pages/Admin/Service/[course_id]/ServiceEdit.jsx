import { AdminSideBar } from "../../../../modules/AdminSideBar";
import { ServiceForm } from "../../../../modules/ServiceForm/ServiceForm";

export const ServiceEdit = () => {
  return (
    <>
      <div className="admin-background">
        <div className="layout-flex">
          <AdminSideBar />
          <main className="admin-main-content">
            <h2 className="admin-page-title">서비스수정</h2>
            <ServiceForm />
          </main>
        </div>
      </div>
    </>
  );
};

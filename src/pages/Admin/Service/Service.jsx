import { AdminSideBar } from "../../../modules/AdminSideBar";
import { ServicePagination } from "../../../modules/ServicePagination";

export const Service = () => {
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

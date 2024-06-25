import { AdminSideBar } from "../../../modules/AdminSideBar";
import { OrdersPagination } from "../../../modules/OrdersPagination";

export const AdminOrders = () => {
  return (
    <>
      <div className="admin-background">
        <div className="layout-flex">
          <AdminSideBar />
          <main className="admin-main-content">
            <h2 className="admin-page-title">결제관리</h2>
            <OrdersPagination />
          </main>
        </div>
      </div>
    </>
  );
};

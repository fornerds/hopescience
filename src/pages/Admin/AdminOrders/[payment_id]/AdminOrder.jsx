import { AdminSideBar } from "../../../../modules/AdminSideBar";
import { AdminReceiptPdfGenerator } from "../../../../modules/PdfGenerator/PdfGenerator";
export const AdminOrder = () => {
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

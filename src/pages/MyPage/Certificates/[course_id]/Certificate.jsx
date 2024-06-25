import { Footer } from "../../../../components/Footer";
import { Header } from "../../../../components/Header";
import { MyPageSideBar } from "../../../../modules/MyPageSideBar";
import { PdfGenerator } from "../../../../modules/PdfGenerator";

export const Certificate = () => {
  return (
    <>
      <Header />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <section className="mypage-section">
            <h2 className="certificates-title">이수증서</h2>
            <PdfGenerator />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

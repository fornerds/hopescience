import { Header } from "../../../components/Header";
import "./style.css";
import { Footer } from "../../../components/Footer";
import { MyPageSideBar } from "../../../modules/MyPageSideBar";
import { TabWithCourses } from "../../../modules/TabWithCourses";

export const MyPage = () => {
  return (
    <>
      <Header />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <section className="mypage-section">
            <h2 className="mypage-title">수강목록</h2>
            <TabWithCourses />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

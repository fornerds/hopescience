import React from "react";
import { Header } from "../../../components/Header";
import "./style.css";
import { Footer } from "../../../components/Footer";
import { MyPageSideBar } from "../../../modules/MyPageSideBar";
import { CertificateTable } from "../../../modules/CertificateTable/CertificateTable";

export const Certificates = () => {
  return (
    <>
      <Header />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <section className="mypage-section">
            <h2 className="certificates-title">이수증서</h2>
            <CertificateTable />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

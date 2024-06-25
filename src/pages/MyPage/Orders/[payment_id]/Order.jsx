import React from "react";
import { Header } from "../../../../components/Header";
import "./style.css";
import { Footer } from "../../../../components/Footer";
import { MyPageSideBar } from "../../../../modules/MyPageSideBar";
import { ReceiptPdfGenerator } from "../../../../modules/PdfGenerator/PdfGenerator";

export const Order = () => {
  return (
    <>
      <Header />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <section className="mypage-section">
            <ReceiptPdfGenerator />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

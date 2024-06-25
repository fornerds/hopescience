import React from "react";
import { Header } from "../../../components/Header";
import "./style.css";
import { Footer } from "../../../components/Footer";
import { MyPageSideBar } from "../../../modules/MyPageSideBar";
import { OrdersPagination } from "../../../modules/OrdersPagination";

export const Orders = () => {
  return (
    <> 
      <Header />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <section className="mypage-section">
            <h2 className="orders-title">결제내역</h2>
            <OrdersPagination />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

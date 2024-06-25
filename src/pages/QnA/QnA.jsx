import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import "./style.css";
import { Footer } from "../../components/Footer";
import { Pagination } from "../../modules/Pagination";
import { inquiry } from "../../store";
import searchIcon from "../../icons/search.svg"

export const QnA = () => {
  const isLoading = inquiry((state) => state.isLoading);
  const getInquiries = inquiry((state) => state.getInquiries);
  const searchInquiries = inquiry((state) => state.searchInquiries);
  const inquiries = inquiry((state) => state.inquiries);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    getInquiries();
  }, []);

  useEffect(() => {
    if (searchKeyword) {
      searchInquiries(searchKeyword);
    } else {
      getInquiries();
    }
  }, [searchKeyword]);

  if (inquiries) {
    console.log(inquiries);
  }

  return (
    <>
      <Header />
      <main className="QnA-background">
        <section className="QnA-section">
          <div className="QnA-header">
            <h3 className="QnA-title">문의게시판</h3>
            <div className="QnA-search-input-wrap">
              <img src={searchIcon} className="search-icon" alt="검색 이미지" />
              <input
                type="search"
                className="QnA-search-input"
                placeholder="Search..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>
          <Pagination inquiries={inquiries} isLoading={isLoading}/>
        </section>
      </main>
      <Footer />
    </>
  );
};

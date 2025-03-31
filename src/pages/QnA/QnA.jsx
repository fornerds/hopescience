import React, { useState, useEffect, useMemo } from "react";
import { Header } from "../../components/Header";
import "./style.css";
import { Footer } from "../../components/Footer";
import { Pagination } from "../../modules/Pagination";
import { inquiry } from "../../store";
import searchIcon from "../../icons/search.svg";

export const QnA = () => {
  const isLoading = inquiry((state) => state.isLoading);
  const getInquiries = inquiry((state) => state.getInquiries);
  const searchInquiries = inquiry((state) => state.searchInquiries);
  const inquiries = inquiry((state) => state.inquiries);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    // 먼저 API로 데이터를 가져옵니다 (정렬 매개변수를 지정해도 됩니다)
    getInquiries(0, 100, "-created_at");
  }, []);

  useEffect(() => {
    if (searchKeyword) {
      searchInquiries(searchKeyword);
    } else {
      getInquiries(0, 100, "-created_at");
    }
  }, [searchKeyword]);

  // 프론트엔드에서 created_at 날짜 기준으로 내림차순 정렬 (최신순)
  const sortedInquiries = useMemo(() => {
    if (!inquiries || inquiries.length === 0) return [];

    // 원본 배열을 변경하지 않도록 새 배열 복사
    return [...inquiries].sort((a, b) => {
      // 날짜를 비교하여 내림차순 정렬 (최신 날짜가 먼저 오도록)
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [inquiries]);

  // 정렬 테스트를 위한 로그
  useEffect(() => {
    if (sortedInquiries.length > 0) {
      console.log("첫 번째 항목 (최신):", sortedInquiries[0].created_at);
      console.log(
        "마지막 항목 (가장 오래됨):",
        sortedInquiries[sortedInquiries.length - 1].created_at
      );
    }
  }, [sortedInquiries]);

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
          {/* 정렬된 배열을 Pagination 컴포넌트에 전달 */}
          <Pagination inquiries={sortedInquiries} isLoading={isLoading} />
        </section>
      </main>
      <Footer />
    </>
  );
};

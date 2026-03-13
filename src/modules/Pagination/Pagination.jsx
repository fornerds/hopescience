import React, { useState, useEffect, useMemo } from "react";
import "./Pagination.css";
import { Link } from "../../components/Link";
import { useLocation, useParams } from "react-router-dom";
import leftArrowButton from "../../icons/chevron-left-large.svg";
import rightArrowButton from "../../icons/chevron-right-large.svg";

// totalCount, onPageChange 를 받으면 서버 사이드 페이지네이션 동작
// 없으면 기존 클라이언트 사이드 페이지네이션 동작 (강의 문의 등)
export const Pagination = ({ inquiries, isLoading, totalCount, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const location = useLocation();
  let { course_id, lecture_id } = useParams();

  const isServerSide = typeof totalCount === "number" && typeof onPageChange === "function";

  const sortedInquiries = useMemo(() => {
    if (isServerSide) return inquiries || [];
    if (!inquiries || inquiries.length === 0) return [];
    return [...inquiries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [inquiries, isServerSide]);

  const totalPosts = isServerSide ? totalCount : sortedInquiries.length;

  const handlePageChange = (page) => {
    if (isServerSide) {
      const skip = (page - 1) * postsPerPage;
      onPageChange(skip, postsPerPage);
    }
    setCurrentPage(page);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPageButtons = () => {
    const pageButtons = [];
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    if (endPage - startPage < 4) {
      startPage = Math.max(endPage - 4, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={
            currentPage === i
              ? "pagination-page-button active"
              : "pagination-page-button"
          }
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pageButtons;
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = isServerSide
    ? sortedInquiries
    : sortedInquiries.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="pagination-container">
      <div className="post-list">
        <div className="post-list-header">
          <div>No</div>
          <div>제목</div>
          <div>글쓴이</div>
          <div>작성일자</div>
          <div>조회수</div>
        </div>
        {isLoading ? (
          <div className="post-item">
            <div></div>
            <div>Loading...</div>
          </div>
        ) : currentPosts && currentPosts.length ? (
          currentPosts.map((post) => (
            <div key={post?.id} className="post-item">
              <div style={{ paddingRight: "10px" }}>{post?.id}</div>
              <Link
                to={
                  location.pathname === "/QnA"
                    ? `/QnA/${post?.id}`
                    : lecture_id === undefined || !lecture_id
                    ? `/courses/${course_id}/1/${post?.id}`
                    : `/courses/${course_id}/${lecture_id}/${post?.id}`
                }
                className="post-item-link"
                label={post?.title}
                style={{
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  color: "#dee1e6",
                  width: "auto",
                  height: "fit-content",
                  textAlign: "left",
                  display: "block",
                  paddingRight: "10px",
                }}
              ></Link>
              <div style={{ paddingRight: "10px" }}>{post?.user_name}</div>
              <div style={{ paddingRight: "10px" }}>
                {new Date(post?.created_at).toLocaleDateString("ko-KR")}
              </div>
              <div style={{ paddingRight: "10px" }}>{post?.view_count}</div>
            </div>
          ))
        ) : (
          <div className="post-item">
            <div></div>
            <div>아직 작성된 질문이 없습니다.</div>
          </div>
        )}
        <div className="post-item-create-button">
          <Link
            to={
              location.pathname === "/QnA"
                ? "/QnA/new"
                : lecture_id === undefined || !lecture_id
                ? `/courses/${course_id}/1/new`
                : `/courses/${course_id}/${lecture_id}/new`
            }
            label="글쓰기"
            buttonStyle="default"
            color="white"
          />
        </div>
      </div>
      <div className="pagination-buttons">
        <button
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <img
            className="img-11"
            alt="Chevron left large"
            src={leftArrowButton}
          />
        </button>
        <div className="pagination-button-wrap">{renderPageButtons()}</div>
        <button
          className={`pagination-button ${
            currentPage === Math.ceil(totalPosts / postsPerPage)
              ? "disabled"
              : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalPosts / postsPerPage)}
        >
          <img
            className="img-11"
            alt="Chevron right large"
            src={rightArrowButton}
          />
        </button>
      </div>
    </div>
  );
};

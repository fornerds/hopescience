import React, { useState } from "react";
import "./Pagination.css";
import { Link } from "../../components/Link";
import { useLocation, useParams } from "react-router-dom";
import leftArrowButton from "../../icons/chevron-left-large.svg"
import rightArrowButton from "../../icons/chevron-right-large.svg"

export const Pagination = ({ inquiries, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const totalPosts = inquiries?.length;
  const location = useLocation();
  let { course_id, lecture_id } = useParams();

  // console.log(inquiries);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageButtons = () => {
    const pageButtons = [];
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, Math.ceil(totalPosts / postsPerPage));

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
  const currentPosts = inquiries?.slice(indexOfFirstPost, indexOfLastPost);

  console.log(currentPosts);

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
        ) : currentPosts.length ? (
          currentPosts?.map((post) => (
            <div key={post?.id} className="post-item">
              <div style={{paddingRight: "10px"}}>{post?.id}</div>
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
                  paddingRight: "10px"
                }}
              >
              </Link>
              <div style={{paddingRight: "10px"}}>{post?.user_name}</div>
              <div style={{paddingRight: "10px"}}>
                {new Date(post?.created_at).toLocaleDateString("ko-KR")}
              </div>
              <div style={{paddingRight: "10px"}}>{post?.view_count}</div>
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

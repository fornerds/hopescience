import { useEffect, useState } from "react";
import { Link } from "../../components/Link";
import leftArrowButton from "../../icons/chevron-left-large.svg";
import rightArrowButton from "../../icons/chevron-right-large.svg";
import { inquiry, courseInquiry, service, useCounselingStore } from "../../store";

export const QnAPagination = () => {
  const [activeTab, setActiveTab] = useState("메인게시판");
  const [categories, setCategories] = useState([]);

  const { getInquiries, inquiries, clearInquiries } = inquiry((state) => ({
    getInquiries: state.getInquiries,
    inquiries: state.inquiries,
    clearInquiries: state.clearInquiries,
  }));

  const { getCourseInquiriesByCategory, courseInquiries } = courseInquiry((state) => ({
    getCourseInquiriesByCategory: state.getCourseInquiriesByCategory,
    courseInquiries: state.courseInquiries,
  }));

  const {isLoading: counselingLoading, getCounselings, counselings } = useCounselingStore((state)=>   ({
    isLoading: state.isLoading,
    getCounselings: state.getCounselings,
    counselings: state.counselings
  }))

  const { getCategories } = service((state) => ({
    getCategories: state.getCategories,
  }));

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (activeTab === "메인게시판") {
      clearInquiries();
      getInquiries();
    } else{
      getCourseInquiriesByCategory(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(()=> {
    getCounselings();
  }, [])

  const fetchCategories = async () => {
    try {
      const categories = await getCategories();
      console.log(categories);
      setCategories(categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7;
  const totalPosts = activeTab === "메인게시판" ? inquiries.length : activeTab === "문의하기" ? counselings.length : courseInquiries.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageButtons = (totalPosts) => {
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
              ? "users-pagination-page-button active"
              : "users-pagination-page-button"
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
  const currentPosts =
    activeTab === "메인게시판"
      ? inquiries.slice(indexOfFirstPost, indexOfLastPost): 
      activeTab === "문의하기" 
        ? 
        counselings.slice(indexOfFirstPost, indexOfLastPost):
        courseInquiries.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <>
      <div className="user-pagination margin-top-43">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div className="user-pagination-tab-menu">
            <button
              className={`user-pagination-tab-button ${
                activeTab === "메인게시판" ? "active" : ""
              }`}
              onClick={() => handleTabClick("메인게시판")}
            >
              메인게시판
            </button>
            <button
              className={`user-pagination-tab-button ${
                activeTab === "문의하기" ? "active" : ""
              }`}
              onClick={() => handleTabClick("문의하기")}
            >
              문의하기
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`user-pagination-tab-button ${
                  activeTab === category.name ? "active" : ""
                }`}
                onClick={() => handleTabClick(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <Link
            to="/admin/QnA/new"
            label="글쓰기"
            style={{ width: "105px", height: "35px", fontSize: "14px" }}
            buttonStyle="default"
            color="white"
          />
        </div>
        <div className="user-pagination-tab-content">
          {activeTab === "메인게시판" && (
            <>
              <div className="user-qna-list margin-top-32">
                <div className="user-qna-list-header">
                  <div>No</div>
                  <div>제목</div>
                  <div>카테고리</div>
                  <div>글쓴이</div>
                  <div>작성일자</div>
                  <div>조회수</div>
                </div>
                {currentPosts.map((post) => (
                  <div key={post.id} className="user-qna-item">
                    <div>{post.id}</div>
                    <Link
                      to={`/admin/QnA/${post.id}`}
                      className="post-item-link"
                      style={{
                        backgroundColor: "transparent",
                        fontFamily: '"Lexend", Helvetica',
                        fontWeight: "700",
                        fontSize: "14px",
                        color: "#dee1e6",
                        height: "18px",
                        textAlign: "left",
                        display: "block",
                        width: "306px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div>{post.title}</div>
                    </Link>
                    <div>{post.category}</div>
                    <div>{post.user_name}</div>
                    <div>{new Date(post.created_at).toLocaleDateString()}</div>
                    <div>{post.view_count}</div>
                  </div>
                ))}
              </div>
              <div className="user-qna-pagination-footer">
                <div className="user-qna-pagination-count">
                  {inquiries.length} results
                </div>
                <div className="user-qna-pagination-buttons">
                  <button
                    className={`user-qna-pagination-button ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <img
                      className="img-11"
                      alt="Chevron left large"
                      src={leftArrowButton}
                    />
                  </button>
                  <div className="user-qna-pagination-button-wrap">
                    {renderPageButtons(inquiries.length)}
                  </div>
                  <button
                    className={`user-qna-pagination-button ${
                      currentPage === Math.ceil(totalPosts / postsPerPage)
                        ? "disabled"
                        : ""
                    }`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={
                      currentPage === Math.ceil(totalPosts / postsPerPage)
                    }
                  >
                    <img
                      className="img-11"
                      alt="Chevron right large"
                      src={rightArrowButton}
                    />
                  </button>
                </div>
              </div>
            </>
          )}
          {activeTab === "문의하기" && (
            <>
              <div className="user-counseling-list margin-top-32">
                <div className="user-counseling-list-header">
                  <div>No</div>
                  <div>글쓴이</div>
                  <div>이메일</div>
                  <div>연락처</div>
                  <div>작성일자</div>
                </div>
                {currentPosts.map((post) => (
                  <div key={post.id} className="user-counseling-item">
                    <div>{post.id}</div>
                    <Link
                      to={`/admin/Counseling/${post.id}`}
                      className="post-item-link"
                      style={{
                        backgroundColor: "transparent",
                        fontFamily: '"Lexend", Helvetica',
                        fontWeight: "700",
                        fontSize: "14px",
                        color: "#dee1e6",
                        height: "18px",
                        textAlign: "left",
                        display: "block",
                        width: "100%",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div>{post.name}</div>
                    </Link>
                    <div>{post.email}</div>
                    <div>{post.phone}</div>
                    <div>{new Date(post.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
              <div className="user-qna-pagination-footer">
                <div className="user-qna-pagination-count">
                  {counselings?.length} results
                </div>
                <div className="user-qna-pagination-buttons">
                  <button
                    className={`user-qna-pagination-button ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <img
                      className="img-11"
                      alt="Chevron left large"
                      src={leftArrowButton}
                    />
                  </button>
                  <div className="user-qna-pagination-button-wrap">
                    {renderPageButtons(counselings?.length)}
                  </div>
                  <button
                    className={`user-qna-pagination-button ${
                      currentPage === Math.ceil(totalPosts / postsPerPage)
                        ? "disabled"
                        : ""
                    }`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={
                      currentPage === Math.ceil(totalPosts / postsPerPage)
                    }
                  >
                    <img
                      className="img-11"
                      alt="Chevron right large"
                      src={rightArrowButton}
                    />
                  </button>
                </div>
              </div>
            </>
          )}
          {categories.map((category) => (
            <div key={category.id}>
              {activeTab === category.name && (
                <>
                  <div className="user-qna-list margin-top-32">
                    <div className="user-qna-list-header">
                      <div>No</div>
                      <div>제목</div>
                      <div>카테고리</div>
                      <div>글쓴이</div>
                      <div>작성일자</div>
                      <div>조회수</div>
                    </div>
                    {currentPosts.map((inquiry) => (
                      <div key={inquiry.id} className="user-qna-item">
                        <div>{inquiry.id}</div>
                        <Link
                          to={`/admin/Category/${inquiry.id}`}
                          className="post-item-link"
                          style={{
                            backgroundColor: "transparent",
                            fontFamily: '"Lexend", Helvetica',
                            fontWeight: "700",
                            fontSize: "14px",
                            color: "#dee1e6",
                            height: "18px",
                            textAlign: "left",
                            display: "block",
                            width: "306px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div>{inquiry.title}</div>
                        </Link>
                        <div>{inquiry.category}</div>
                        <div>{inquiry.user_name}</div>
                        <div>
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </div>
                        <div>{inquiry.view_count}</div>
                      </div>
                    ))}
                  </div>
                  <div className="user-qna-pagination-footer">
                    <div className="user-qna-pagination-count">
                      {courseInquiries.length} results
                    </div>
                    <div className="user-qna-pagination-buttons">
                      <button
                        className={`user-qna-pagination-button ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <img
                          className="img-11"
                          alt="Chevron left large"
                          src={leftArrowButton}
                        />
                      </button>
                      <div className="user-qna-pagination-button-wrap">
                        {renderPageButtons(courseInquiries.length)}
                      </div>
                      <button
                        className={`user-qna-pagination-button ${
                          currentPage ===
                          Math.ceil(courseInquiries.length / postsPerPage)
                            ? "disabled"
                            : ""
                        }`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage ===
                          Math.ceil(courseInquiries.length / postsPerPage)
                        }
                      >
                        <img
                          className="img-11"
                          alt="Chevron right large"
                          src={rightArrowButton}
                        />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
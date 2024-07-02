import { useState, useEffect } from "react";
import "./UserPagination.css";
import { Link } from "../../components/Link";
import leftArrowButton from "../../icons/chevron-left-large.svg";
import rightArrowButton from "../../icons/chevron-right-large.svg";
import { user, payment } from "../../store";
import { useParams } from "react-router-dom";

const TAB_BUTTONS = [
  { key: "inProgress", label: "수강 중인 강의" },
  { key: "purchases", label: "구매한 내역" },
  { key: "posts", label: "게시물" },
];

const POSTS_PER_PAGE = 7;

export const UserPagination = () => {
  const [activeTab, setActiveTab] = useState("inProgress");
  const [currentPageInProgress, setCurrentPageInProgress] = useState(1);
  const [currentPagePurchases, setCurrentPagePurchases] = useState(1);
  const [currentPagePosts, setCurrentPagePosts] = useState(1);
  const { user_id } = useParams();
  const getEnrollments = user((state) => state.getEnrollments);
  const enrollments = user((state) => state.enrollments);
  const isEnrollmentsLoading = user((state) => state.isLoading);
  const getPaymentByUser = payment((state) => state.getPaymentByUser);
  const payments = payment((state) => state.payment);
  const isPaymentsLoading = payment((state) => state.isLoading);
  const getUserQnA = user((state) => state.getUserQnA);
  const userQnA = user((state) => state.userQnA);

  useEffect(() => {
    const fetchEnrollments = async () => {
      const enrollmentsData = await getEnrollments(user_id);
      user.setState({ enrollments: enrollmentsData, isLoading: false });
    };
    fetchEnrollments();
  }, [getEnrollments, user_id]);

  useEffect(() => {
    const fetchPayments = async () => {
      await getPaymentByUser(user_id);
    };
    fetchPayments();
  }, [getPaymentByUser, user_id]);

  useEffect(() => {
    const fetchUserQnA = async () => {
      await getUserQnA(user_id);
    };
    fetchUserQnA();
  }, [getUserQnA, user_id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPageInProgress(1);
    setCurrentPagePurchases(1);
    setCurrentPagePosts(1);
  };

  const handlePageChangeInProgress = (page) => {
    setCurrentPageInProgress(page);
  };

  const handlePageChangePurchases = (page) => {
    setCurrentPagePurchases(page);
  };

  const handlePageChangePosts = (page) => {
    setCurrentPagePosts(page);
  };

  const renderPaginationButtons = (totalItems, currentPage, onPageChange) => {
    const totalPages = Math.ceil(totalItems / POSTS_PER_PAGE);
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    if (endPage - startPage < 4) {
      startPage = Math.max(endPage - 4, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => {
      const pageNumber = startPage + index;
      return (
        <button
          key={pageNumber}
          className={`pagination-page-button ${
            currentPage === pageNumber ? "active" : ""
          }`}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      );
    });
  };

  const renderEnrollments = (enrollments, currentPage) => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentEnrollments = enrollments?.slice(startIndex, endIndex);

    const formatDate = (dateString) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    };

    const formatCompletionDate = (dateString) => {
      if (!dateString) return "미완료";
      return formatDate(dateString);
    };

    return currentEnrollments?.map((enrollment, index) => (
      <div key={enrollment.id} className="user-lecture-item">
        <div>{startIndex + index + 1}</div>
        <div>{enrollment.course_title}</div>
        <div>{formatDate(enrollment.enrolled_at)}</div>
        <div>{formatCompletionDate(enrollment.completed_at)}</div>
        <div>{enrollment.progress}%</div>
      </div>
    ));
  };

  const getPaymentStatusClassName = (status) => {
    const statusClassMap = {
      결제취소: "cancel",
      결제중: "paying",
      DONE: "paid",
    };
    return statusClassMap[status] || "";
  };

  const renderPayments = (payments, currentPage) => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentPayments = payments?.slice(startIndex, endIndex);

    return currentPayments?.map((payment) => (
      <div key={payment.id} className="order-item">
        <div>
          <input type="checkbox" name={payment.id} id={payment.id} />
        </div>
        <div
          className={`order-item-state ${getPaymentStatusClassName(
            payment.status
          )}`}
        >
          {payment.status}
        </div>
        <div>#{payment.order_id}</div>
        <Link
          to={`/admin/orders/${payment.order_id}`}
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
          <div>{payment.course_title}</div>
        </Link>
        <div>{payment.category_name}</div>
        <div>₩{payment.amount}</div>
        <div>{new Date(payment.created_at).toLocaleDateString()}</div>
      </div>
    ));
  };

  const renderPosts = (posts, currentPage) => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentPosts = posts?.slice(startIndex, endIndex);

    return currentPosts?.map((post, index) => (
      <div key={post.id} className="user-qna-item">
        <div>{startIndex + index + 1}</div>
        <Link
          to={`/admin/QnA/${post.id}`}
          className="post-item-link"
          style={{
            backgroundColor: "transparent",
            fontFamily: '"Lexend", Helvetica',
            fontWeight: "700",
            fontSize: "14px",
            color: "#dee1e6",
            width: "auto",
            height: "18px",
            textAlign: "left",
            display: "block",
          }}
        >
          <div>{post.title}</div>
        </Link>
        <div>{post.category}</div>
        <div>{post.user_name}</div>
        <div>{new Date(post.created_at).toLocaleDateString()}</div>
        <div>{post.view_count}</div>
      </div>
    ));
  };

  if (isEnrollmentsLoading || isPaymentsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-pagination">
      <div className="user-pagination-tab-menu">
        {TAB_BUTTONS.map((tab) => (
          <button
            key={tab.key}
            className={`user-pagination-tab-button ${
              activeTab === tab.key ? "active" : ""
            }`}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="user-pagination-tab-content">
        {activeTab === "inProgress" && (
          <>
            <div className="user-lecture-list margin-top-32">
              <div className="user-lecture-header">
                <div>No</div>
                <div>강의명</div>
                <div>등록일</div>
                <div>수강완료일</div>
                <div>진도율</div>
              </div>
              {renderEnrollments(enrollments, currentPageInProgress)}
            </div>
            <div className="user-lecture-pagination-footer">
              <div className="user-lecture-pagination-count">
                {enrollments?.length || 0} results
              </div>
              <div className="user-lecture-pagination-buttons">
                <button
                  className={`user-lecture-pagination-button ${
                    currentPageInProgress === 1 ? "disabled" : ""
                  }`}
                  onClick={() =>
                    handlePageChangeInProgress(currentPageInProgress - 1)
                  }
                  disabled={currentPageInProgress === 1}
                >
                  <img
                    className="img-11"
                    alt="Chevron left large"
                    src={leftArrowButton}
                  />
                </button>
                <div className="user-lecture-pagination-button-wrap">
                  {renderPaginationButtons(
                    enrollments?.length || 0,
                    currentPageInProgress,
                    handlePageChangeInProgress
                  )}
                </div>
                <button
                  className={`user-lecture-pagination-button ${
                    currentPageInProgress ===
                    Math.ceil((enrollments?.length || 0) / POSTS_PER_PAGE)
                      ? "disabled"
                      : ""
                  }`}
                  onClick={() =>
                    handlePageChangeInProgress(currentPageInProgress + 1)
                  }
                  disabled={
                    currentPageInProgress ===
                    Math.ceil((enrollments?.length || 0) / POSTS_PER_PAGE)
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
        {activeTab === "purchases" && (
          <>
            <div className="order-list margin-top-32">
              <div className="order-list-header">
                <div></div>
                <div>상태</div>
                <div>결제ID</div>
                <div>상품명</div>
                <div>카테고리</div>
                <div>결제금액</div>
                <div>결제일자</div>
              </div>
              {renderPayments(payments, currentPagePurchases)}
            </div>
            <div className="order-pagination-footer">
              <div className="order-pagination-count">
                {payments?.length || 0} results
              </div>
              <div className="order-pagination-buttons">
                <button
                  className={`order-pagination-button ${
                    currentPagePurchases === 1 ? "disabled" : ""
                  }`}
                  onClick={() =>
                    handlePageChangePurchases(currentPagePurchases - 1)
                  }
                  disabled={currentPagePurchases === 1}
                >
                  <img
                    className="img-11"
                    alt="Chevron left large"
                    src={leftArrowButton}
                  />
                </button>
                <div className="order-pagination-button-wrap">
                  {renderPaginationButtons(
                    payments?.length || 0,
                    currentPagePurchases,
                    handlePageChangePurchases
                  )}
                </div>
                <button
                  className={`order-pagination-button ${
                    currentPagePurchases ===
                    Math.ceil((payments?.length || 0) / POSTS_PER_PAGE)
                      ? "disabled"
                      : ""
                  }`}
                  onClick={() =>
                    handlePageChangePurchases(currentPagePurchases + 1)
                  }
                  disabled={
                    currentPagePurchases ===
                    Math.ceil((payments?.length || 0) / POSTS_PER_PAGE)
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
        {activeTab === "posts" && (
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
              {renderPosts(userQnA, currentPagePosts)}
            </div>
            <div className="user-qna-pagination-footer">
              <div className="user-qna-pagination-count">
                {userQnA?.length || 0} results
              </div>
              <div className="user-qna-pagination-buttons">
                <button
                  className={`user-qna-pagination-button ${
                    currentPagePosts === 1 ? "disabled" : ""
                  }`}
                  onClick={() => handlePageChangePosts(currentPagePosts - 1)}
                  disabled={currentPagePosts === 1}
                >
                  <img
                    className="img-11"
                    alt="Chevron left large"
                    src={leftArrowButton}
                  />
                </button>
                <div className="user-qna-pagination-button-wrap">
                  {renderPaginationButtons(
                    userQnA?.length || 0,
                    currentPagePosts,
                    handlePageChangePosts
                  )}
                </div>
                <button
                  className={`user-qna-pagination-button ${
                    currentPagePosts ===
                    Math.ceil((userQnA?.length || 0) / POSTS_PER_PAGE)
                      ? "disabled"
                      : ""
                  }`}
                  onClick={() => handlePageChangePosts(currentPagePosts + 1)}
                  disabled={
                    currentPagePosts ===
                    Math.ceil((userQnA?.length || 0) / POSTS_PER_PAGE)
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
    </div>
  );
}
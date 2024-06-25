import React, { useState, useEffect } from "react";
import "./OrdersPagination.css";
import { Link } from "../../components/Link";
import { useLocation } from "react-router-dom";
import { payment } from "../../store";
import searchIcon from "../../icons/search.svg"
import leftArrowButton from "../../icons/chevron-left-large.svg"
import rightArrowButton from "../../icons/chevron-right-large.svg"

// const mockData = [
//   {
//     id: 1139,
//     state: "결제취소",
//     user: "김복동",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-04-16",
//   },
//   {
//     id: 1104,
//     state: "결제중",
//     user: "marktaylor",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-04-08",
//   },
//   {
//     id: 996,
//     state: "결제완료",
//     user: "johnnelson",
//     course: "디지털 장의사",
//     category: "디지털 장의사",
//     price: "428,000",
//     paymentDate: "2024-04-02",
//   },
//   {
//     id: 984,
//     state: "결제완료",
//     user: "너구리",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-03-22",
//   },
//   {
//     id: 975,
//     state: "결제완료",
//     user: "짱짱맨",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-03-21",
//   },
//   {
//     id: 973,
//     state: "결제취소",
//     user: "김복동",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-02-16",
//   },
//   {
//     id: 971,
//     state: "결제완료",
//     user: "김복동",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-02-16",
//   },
//   {
//     id: 970,
//     state: "결제완료",
//     user: "김복동",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-02-16",
//   },
//   {
//     id: 969,
//     state: "결제완료",
//     user: "김복동",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-02-16",
//   },
//   {
//     id: 968,
//     state: "결제완료",
//     user: "김복동",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-02-16",
//   },
//   {
//     id: 967,
//     state: "결제완료",
//     user: "김복동",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-02-16",
//   },
//   {
//     id: 966,
//     state: "결제완료",
//     user: "김복동",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-02-16",
//   },
//   {
//     id: 965,
//     state: "결제완료",
//     user: "김복동",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-02-16",
//   },
//   {
//     id: 964,
//     state: "결제완료",
//     user: "김복동",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-02-16",
//   },
//   {
//     id: 963,
//     state: "결제완료",
//     user: "김복동",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-02-16",
//   },
//   {
//     id: 962,
//     state: "결제완료",
//     user: "김복동",
//     course: "직장내 성희롱 예방교육",
//     category: "양형교육",
//     price: "258,000",
//     paymentDate: "2024-02-16",
//   },
// ];

export const OrdersPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLink, setCurrentLink] = useState("/mypage/orders/");
  const postsPerPage = 7; // 한 페이지당 보여줄 데이터 수를 7로 변경
  const getPayments = payment((state)=>state.getPayments);
  const payments = payment((state)=>state.payments);
  const isLoading = payment((state)=>state.isLoading);
  const totalPosts = payments?.length || 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/admin/orders") {
      setCurrentLink("/admin/orders/");
      getPayments();
    }
  }, [location]);

  const renderPageButtons = () => {
    const pageButtons = [];
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    // 현재 페이지가 첫 번째 페이지에 가까워서 페이지 버튼이 충분하지 않은 경우
    if (endPage - startPage < 4) {
      startPage = Math.max(endPage - 4, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={
            currentPage === i
              ? "order-pagination-page-button active"
              : "order-pagination-page-button"
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
  const currentPosts = payments.slice(indexOfFirstPost, indexOfLastPost);

  const getStateClassName = (state) => {
    const stateClassMap = {
      CANCEL: "결제취소",
      READY: "결제중",
      DONE: "결제완료",
      COMPLETED: "결제확인",
    };
    return stateClassMap[state] || "";
  };

  return (
    <div className="order-pagination-container">
      <div className="order-pagination-sort-wrap">
        <div className="order-pagination-search-input-wrap">
          <img src={searchIcon} className="order-pagination-search-icon" alt="검색 이미지" />
          <input
            type="search"
            className="order-pagination-search-input"
            placeholder="Search..."
          />
        </div>
        <div className="order-category">
          <select id="order-category-select" name="order-category-select">
            <option defaultValue="">카테고리</option>
            <option value="양형교육">양형교육</option>
            <option value="디지털 장의사">디지털 장의사</option>
          </select>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <path
              d="M3.06559 4.5061L2.12695 5.44474L7.37695 10.6947L12.627 5.44474L11.6883 4.5061L7.37695 8.81744L3.06559 4.5061Z"
              fill="#9095a1"
            />
          </svg>
        </div>
      </div>
      <div className="order-list">
        <div className="order-list-header">
          <div></div>
          <div>상태</div>
          <div className="order-pagination-mobile-hide">결제ID</div>
          <div>상품명</div>
          <div className="order-pagination-mobile-hide">카테고리</div>
          <div className="order-pagination-mobile-hide">결제금액</div>
          <div>결제일자</div>
        </div>
        {isLoading ? (
        <div className="order-item">
          <div></div>
          <div>Loading...</div>
        </div>
        ) : ( currentPosts.map((post) => (
          <div key={post.order_id} className="order-item">
            <div>
              <input type="checkbox" name={post.order_id} id={post.order_id} />
            </div>
            <div
              className={`order-item-state ${post.status}`}
            >
              {getStateClassName(post.status)}
            </div>
            <div className="order-pagination-mobile-hide">#{post.order_id}</div>
            <Link
              to={`${currentLink}${post.order_id}`}
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
              <div>{post.course_title}</div>
            </Link>
            <div className="order-pagination-mobile-hide">{post.category}</div>
            <div className="order-pagination-mobile-hide">₩{(post.amount).toLocaleString()}</div>
            <div>{new Date(post.created_at).toLocaleDateString("ko-KR")}</div>
          </div>
        )))}
      </div>
      <div className="order-pagination-footer">
        <div className="order-pagination-count">{payments?.length || 0} results</div>
        <div className="order-pagination-buttons">
          <button
            className={`order-pagination-button ${
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
          <div className="order-pagination-button-wrap">
            {renderPageButtons()}
          </div>
          <button
            className={`order-pagination-button ${
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
    </div>
  );
};

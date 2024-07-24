import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./OrdersPagination.css";
import { Link } from "../../components/Link";
import { useLocation } from "react-router-dom";
import { payment, service } from "../../store";
import searchIcon from "../../icons/search.svg"
import leftArrowButton from "../../icons/chevron-left-large.svg"
import rightArrowButton from "../../icons/chevron-right-large.svg"

export const OrdersPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLink, setCurrentLink] = useState("/mypage/orders/");
  const postsPerPage = 7;
  const getPayments = payment((state) => state.getPayments);
  const payments = payment((state) => state.payments);
  const isLoading = payment((state) => state.isLoading);
  const getPaymentByUser = payment((state) => state.getPaymentByUser);
  const clearPayments = payment((state) => state.clearPayments);
  const categories = service((state) => state.categories || []);
  const getCategories = service((state) => state.getCategories);
  const searchPayments = payment((state) => state.searchPayments);
  const searchUserPayments = payment((state) => state.searchUserPayments);
  const sortbyCategoryPayments = payment((state) => state.sortbyCategoryPayments);
  const sortUserPaymentsByCategory = payment((state) => state.sortUserPaymentsByCategory);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [error, setError] = useState(null);

  const location = useLocation();

  const myUserId = useMemo(() => {
    const data = sessionStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userId : null;
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        clearPayments();
        if (location.pathname === "/admin/orders") {
          setCurrentLink("/admin/orders/");
          if (searchKeyword) {
            await searchPayments(searchKeyword);
          } else if (selectedCategory) {
            await sortbyCategoryPayments(selectedCategory);
          } else {
            await getPayments();
          }
        } else if (location.pathname === "/mypage/orders" && myUserId) {
          setCurrentLink("/mypage/orders/");
          if (searchKeyword) {
            await searchUserPayments(myUserId, searchKeyword);
          } else if (selectedCategory) {
            await sortUserPaymentsByCategory(myUserId, selectedCategory);
          } else {
            await getPaymentByUser(myUserId);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, [location.pathname, myUserId, searchKeyword, selectedCategory, clearPayments, searchPayments, sortbyCategoryPayments, getPayments, searchUserPayments, sortUserPaymentsByCategory, getPaymentByUser]);

  const totalPosts = payments?.length || 0;

  const currentPosts = useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return payments.slice(indexOfFirstPost, indexOfLastPost);
  }, [payments, currentPage, postsPerPage]);

  const renderPageButtons = useCallback(() => {
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
  }, [currentPage, totalPosts, postsPerPage, handlePageChange]);

  const getStateClassName = useCallback((state) => {
    const stateClassMap = {
      CANCELED: "결제취소",
      READY: "결제중",
      DONE: "결제완료",
      COMPLETED: "결제확인",
    };
    return stateClassMap[state] || "";
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="order-pagination-container">
      <div className="order-pagination-sort-wrap">
        <div className="order-pagination-search-input-wrap">
          <img src={searchIcon} className="order-pagination-search-icon" alt="검색 이미지" />
          <input
            type="search"
            className="order-pagination-search-input"
            placeholder="Search..."
            value={searchKeyword}
            onChange={handleSearchChange}
          />
        </div>
        <div className="order-category">
          <select
            id="order-category-select"
            name="order-category-select" 
            value={selectedCategory}
            onChange={handleCategoryChange}  
          >
            <option value="">전체 카테고리</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
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
            <div className="order-pagination-mobile-hide">{post.category_name}</div>
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
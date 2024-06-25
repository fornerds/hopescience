import React, { useState, useEffect } from "react";
import "./ServicePagination.css";
import { Link } from "../../components/Link";
import { Button } from "../../components/Button";
import { service } from "../../store";
import searchIcon from "../../icons/search.svg"
import leftArrowButton from "../../icons/chevron-left-large.svg"
import rightArrowButton from "../../icons/chevron-right-large.svg"

export const ServicePagination = () => {
  const isLoading = service((state) => state.isLoading);
  const getServices = service((state) => state.getServices);
  const deleteService = service((state) => state.deleteService);
  const [selectedIds, setSelectedIds] = useState([]);
  const services = service((state) => state.services || []);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7;
  const totalPosts = services.length;

  useEffect(() => {
    getServices();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
              ? "service-pagination-page-button active"
              : "service-pagination-page-button"
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
  const currentPosts = services?.slice(indexOfFirstPost, indexOfLastPost);

  const getStatusClassName = (status) => {
    const statusClassMap = {
      활성화: "active",
      비활성화: "deactive",
      작성중: "writing",
    };
    return statusClassMap[status] || "";
  };

  const handleCheckboxChange = (serviceId) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(serviceId)
        ? currentIds.filter((id) => id !== serviceId)
        : [...currentIds, serviceId]
    );
  };

  const handleDeleteSelected = () => {
    console.log(selectedIds);
    // selectedIds.forEach((id) => {
    //   deleteService(id).then(() => {
    //     getServices(); // Refresh the list after deletion
    //   });
    // });
    setSelectedIds([]); // Reset selection after deletion
  };

  return (
    <div className="service-pagination-container">
      <div className="service-pagination-container-header">
        <div className="service-pagination-sort-wrap">
          <div className="service-pagination-search-input-wrap">
            <img src={searchIcon} className="search-icon" alt="검색이미지" />
            <input
              type="search"
              className="service-pagination-search-input"
              placeholder="Search..."
            />
          </div>
          <div className="service-category">
            <select id="service-category-select" name="service-category-select">
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
        <div className="service-pagination-action-wrap">
          <Button
            label="선택된 서비스 삭제"
            variant="danger"
            style={{
              fontSize: "14px",
              padding: "7px 20px",
              width: "fit-content",
              height: "fit-content",
            }}
            onClick={handleDeleteSelected}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16px"
              height="14px"
              viewBox="0 0 24 22"
              fill="none"
            >
              <path
                d="M10 12V17"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 12V17"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 7H20"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <Link
            to="/admin/service/new"
            label="서비스 등록하기"
            style={{
              fontSize: "14px",
              padding: "7px 20px",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4 12H20M12 4V20"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className="service-list">
        <div className="service-list-header">
          <div></div>
          <div>서비스명</div>
          <div>카테고리</div>
          <div>기본가격</div>
          <div>할인가격</div>
          <div>등록일자</div>
          <div>서비스상태</div>
          <div></div>
        </div>
        {isLoading ? (
          <div className="service-item">
            <div></div>
            <p className="">Loading...</p>
          </div>
        ) : (
          currentPosts.map((post) => (
            <div key={post.id} className="service-item">
              <div>
                <input
                  type="checkbox"
                  name={post.id}
                  id={post.id}
                  checked={selectedIds.includes(post.id)}
                  onChange={() => handleCheckboxChange(post.id)}
                />
              </div>
              <Link
                to={`/admin/service/${post.id}`}
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
              <div>{post.category.name}</div>
              <div>₩ {post.price}</div>
              <div>₩ {post.discounted_price}</div>
              <div>{new Date(post.created_at).toLocaleDateString("ko-KR")}</div>
              <div
                className={`service-item-state ${getStatusClassName(
                  post.is_active ? "활성화" : "비활성화"
                )}`}
              >
                {post.is_active ? "활성화" : "비활성화"}
              </div>
              <Dropdown />
            </div>
          ))
        )}
      </div>
      <div className="service-pagination-footer">
        <div className="service-pagination-count">
          {services ? services.length : 0} results
        </div>
        <div className="service-pagination-buttons">
          <button
            className={`service-pagination-button ${
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
          <div className="service-pagination-button-wrap">
            {renderPageButtons()}
          </div>
          <button
            className={`service-pagination-button ${
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

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 상태를 관리하는 상태 변수
  const [selectedOption, setSelectedOption] = useState(""); // 선택된 옵션을 저장하는 상태 변수

  // 드롭다운 메뉴를 토글하는 함수
  const toggleDropdown = () => setIsOpen(!isOpen);

  // 옵션 선택 핸들러
  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setIsOpen(false); // 옵션 선택 후 드롭다운 닫기
  };

  return (
    <div className="dropdown">
      <Button
        label=""
        style={{ backgroundColor: "transparent", width: "24px" }}
        onClick={toggleDropdown}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="6" r="1.5" fill="#ffffff" />
          <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
          <circle cx="12" cy="18" r="1.5" fill="#ffffff" />
        </svg>
      </Button>
      {isOpen && ( // isOpen이 true일 때만 드롭다운 메뉴를 표시
        <ul className="dropdown-menu">
          <li onClick={() => handleSelectOption("활성화")}>활성화</li>
          <li onClick={() => handleSelectOption("비활성화")}>비활성화</li>
        </ul>
      )}
    </div>
  );
}

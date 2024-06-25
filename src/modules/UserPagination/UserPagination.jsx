import { useState } from "react";
import "./UserPagination.css";
import { Link } from "../../components/Link";
import leftArrowButton from "../../icons/chevron-left-large.svg"
import rightArrowButton from "../../icons/chevron-right-large.svg"

const tabButtons = [
  { key: "Orders", label: "구매한 내역" },
  { key: "QnA", label: "게시물" },
];

const userOrders = [
  {
    id: 1139,
    state: "결제취소",
    user: "김복동",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-04-16",
  },
  {
    id: 1104,
    state: "결제중",
    user: "marktaylor",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-04-08",
  },
  {
    id: 996,
    state: "결제완료",
    user: "johnnelson",
    course: "디지털 장의사",
    category: "디지털 장의사",
    price: "428,000",
    paymentDate: "2024-04-02",
  },
  {
    id: 984,
    state: "결제완료",
    user: "너구리",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-03-22",
  },
  {
    id: 975,
    state: "결제완료",
    user: "짱짱맨",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-03-21",
  },
  {
    id: 973,
    state: "결제취소",
    user: "김복동",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-02-16",
  },
  {
    id: 971,
    state: "결제완료",
    user: "김복동",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-02-16",
  },
  {
    id: 970,
    state: "결제완료",
    user: "김복동",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-02-16",
  },
  {
    id: 969,
    state: "결제완료",
    user: "김복동",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-02-16",
  },
  {
    id: 968,
    state: "결제완료",
    user: "김복동",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-02-16",
  },
  {
    id: 967,
    state: "결제완료",
    user: "김복동",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-02-16",
  },
  {
    id: 966,
    state: "결제완료",
    user: "김복동",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-02-16",
  },
  {
    id: 965,
    state: "결제완료",
    user: "김복동",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-02-16",
  },
  {
    id: 964,
    state: "결제완료",
    user: "김복동",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-02-16",
  },
  {
    id: 963,
    state: "결제완료",
    user: "김복동",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-02-16",
  },
  {
    id: 962,
    state: "결제완료",
    user: "김복동",
    course: "직장내 성희롱 예방교육",
    category: "양형교육",
    price: "258,000",
    paymentDate: "2024-02-16",
  },
];

const userQnA = [
  {
    id: 1,
    title: "Understanding Machine Learning",
    category: "Technology",
    writer: "Alex Kim",
    publishDate: "2024-03-15",
    views: 512,
  },
  {
    id: 2,
    title: "Best Practices for Healthy Eating",
    category: "Health",
    writer: "Mina Choi",
    publishDate: "2024-02-28",
    views: 291,
  },
  {
    id: 3,
    title: "The Future of Renewable Energy",
    category: "Environment",
    writer: "John Lee",
    publishDate: "2024-01-20",
    views: 465,
  },
  {
    id: 4,
    title: "History of the Internet",
    category: "Education",
    writer: "Sara Park",
    publishDate: "2024-03-01",
    views: 300,
  },
  {
    id: 5,
    title: "Top 10 Investment Strategies for 2024",
    category: "Finance",
    writer: "David Cho",
    publishDate: "2024-01-10",
    views: 620,
  },
  {
    id: 6,
    title: "Exploring the Depths of the Ocean",
    category: "Science",
    writer: "Emily Han",
    publishDate: "2024-03-05",
    views: 350,
  },
  {
    id: 7,
    title: "Beginners Guide to Yoga",
    category: "Fitness",
    writer: "Michael Yoon",
    publishDate: "2024-02-14",
    views: 410,
  },
  {
    id: 8,
    title: "How to Improve Your Writing Skills",
    category: "Education",
    writer: "Sophie Lee",
    publishDate: "2024-02-20",
    views: 255,
  },
  {
    id: 9,
    title: "Secrets of Successful Entrepreneurs",
    category: "Business",
    writer: "Lucas Kim",
    publishDate: "2024-03-03",
    views: 530,
  },
  {
    id: 10,
    title: "The Impact of Climate Change",
    category: "Environment",
    writer: "Olivia Jeong",
    publishDate: "2024-03-18",
    views: 480,
  },
  {
    id: 11,
    title: "Discovering New Artists and Music Trends",
    category: "Entertainment",
    writer: "Brian Choi",
    publishDate: "2024-02-22",
    views: 390,
  },
  {
    id: 12,
    title: "How to Stay Safe Online",
    category: "Technology",
    writer: "Grace Park",
    publishDate: "2024-03-10",
    views: 650,
  },
  {
    id: 13,
    title: "Global Economic Outlook for 2024",
    category: "Finance",
    writer: "Ethan Kang",
    publishDate: "2024-01-25",
    views: 280,
  },
  {
    id: 14,
    title: "Innovations in Artificial Intelligence",
    category: "Technology",
    writer: "Lily Kim",
    publishDate: "2024-02-15",
    views: 500,
  },
  {
    id: 15,
    title: "Learning Foreign Languages",
    category: "Education",
    writer: "Noah Lee",
    publishDate: "2024-02-05",
    views: 320,
  },
  {
    id: 16,
    title: "Nutritional Myths Debunked",
    category: "Health",
    writer: "Emma Choi",
    publishDate: "2024-03-07",
    views: 290,
  },
  {
    id: 17,
    title: "The Evolution of Cinema",
    category: "Entertainment",
    writer: "Jack Kim",
    publishDate: "2024-02-12",
    views: 430,
  },
  {
    id: 18,
    title: "Ultimate Guide to Backpacking in Europe",
    category: "Travel",
    writer: "Chloe Lee",
    publishDate: "2024-03-21",
    views: 370,
  },
  {
    id: 19,
    title: "Mindfulness and Mental Health",
    category: "Health",
    writer: "Daniel Yoo",
    publishDate: "2024-01-30",
    views: 260,
  },
  {
    id: 20,
    title: "Revolutionizing Healthcare with Technology",
    category: "Science",
    writer: "Sophia Park",
    publishDate: "2024-02-01",
    views: 540,
  },
];

export const UserPagination = () => {
  const [activeTab, setActiveTab] = useState("purchases");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7; // 한 페이지당 보여줄 데이터 수를 7로 변경
  const totalPosts = userOrders.length;

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
  const currentPosts = userOrders.slice(indexOfFirstPost, indexOfLastPost);

  const getStateClassName = (state) => {
    const stateClassMap = {
      결제취소: "cancel",
      결제중: "paying",
      결제완료: "paid",
    };
    return stateClassMap[state] || "";
  };

  const [currentPage2, setCurrentPage2] = useState(1);
  const postsPerPage2 = 7; // 한 페이지당 보여줄 데이터 수를 7로 변경
  const totalPosts2 = userQnA.length;

  const handlePageChange2 = (page) => {
    setCurrentPage2(page);
  };

  const renderPageButtons2 = () => {
    const pageButtons2 = [];
    const totalPages2 = Math.ceil(totalPosts2 / postsPerPage);
    let startPage2 = Math.max(currentPage2 - 2, 1);
    let endPage2 = Math.min(startPage2 + 4, totalPages2);

    // 현재 페이지가 첫 번째 페이지에 가까워서 페이지 버튼이 충분하지 않은 경우
    if (endPage2 - startPage2 < 4) {
      startPage2 = Math.max(endPage2 - 4, 1);
    }

    for (let i = startPage2; i <= endPage2; i++) {
      pageButtons2.push(
        <button
          key={i}
          className={
            currentPage2 === i
              ? "users-pagination-page-button active"
              : "users-pagination-page-button"
          }
          onClick={() => handlePageChange2(i)}
        >
          {i}
        </button>
      );
    }

    return pageButtons2;
  };

  const indexOfLastPost2 = currentPage2 * postsPerPage2;
  const indexOfFirstPost2 = indexOfLastPost2 - postsPerPage2;
  const currentPosts2 = userQnA.slice(indexOfFirstPost2, indexOfLastPost2);

  return (
    <>
      <div className="user-pagination">
        <div className="user-pagination-tab-menu">
          <button
            className={`user-pagination-tab-button ${
              activeTab === "purchases" ? "active" : ""
            }`}
            onClick={() => handleTabClick("purchases")}
          >
            구매한 목록
          </button>
          <button
            className={`user-pagination-tab-button ${
              activeTab === "posts" ? "active" : ""
            }`}
            onClick={() => handleTabClick("posts")}
          >
            게시물
          </button>
        </div>
        <div className="user-pagination-tab-content">
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
                {currentPosts.map((post) => (
                  <div key={post.id} className="order-item">
                    <div>
                      <input type="checkbox" name={post.id} id={post.id} />
                    </div>
                    <div
                      className={`order-item-state ${getStateClassName(
                        post.state
                      )}`}
                    >
                      {post.state}
                    </div>
                    <div>#{post.id}</div>
                    <Link
                      to={`/admin/orders/${post.id}`}
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
                      <div>{post.course}</div>
                    </Link>
                    <div>{post.category}</div>
                    <div>₩{post.price}</div>
                    <div>{post.paymentDate}</div>
                  </div>
                ))}
              </div>
              <div className="order-pagination-footer">
                <div className="order-pagination-count">
                  {userOrders.length} results
                </div>
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
                {currentPosts2.map((post) => (
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
                        width: "auto",
                        height: "18px",
                        textAlign: "left",
                        display: "block",
                      }}
                    >
                      <div>{post.title}</div>
                    </Link>
                    <div>{post.category}</div>

                    <div>{post.writer}</div>
                    <div>{post.publishDate}</div>
                    <div>{post.views}</div>
                  </div>
                ))}
              </div>
              <div className="user-qna-pagination-footer">
                <div className="user-qna-pagination-count">
                  {userQnA.length} results
                </div>
                <div className="user-qna-pagination-buttons">
                  <button
                    className={`user-qna-pagination-button ${
                      currentPage2 === 1 ? "disabled" : ""
                    }`}
                    onClick={() => handlePageChange2(currentPage2 - 1)}
                    disabled={currentPage2 === 1}
                  >
                    <img
                      className="img-11"
                      alt="Chevron left large"
                      src={leftArrowButton}
                    />
                  </button>
                  <div className="user-qna-pagination-button-wrap">
                    {renderPageButtons2()}
                  </div>
                  <button
                    className={`user-qna-pagination-button ${
                      currentPage2 === Math.ceil(totalPosts2 / postsPerPage2)
                        ? "disabled"
                        : ""
                    }`}
                    onClick={() => handlePageChange2(currentPage2 + 1)}
                    disabled={
                      currentPage2 === Math.ceil(totalPosts2 / postsPerPage2)
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
    </>
  );
};

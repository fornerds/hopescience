import { useEffect, useState } from "react";
import { Link } from "../../components/Link";
import leftArrowButton from "../../icons/chevron-left-large.svg"
import rightArrowButton from "../../icons/chevron-right-large.svg"
import { inquiry, courseInquiry } from "../../store";

const QnAList = [
  {
    id: 1,
    title: "환불 가능한가요?",
    category: "QnA",
    writer: "너구리",
    publishDate: "2024-03-15",
    views: 512,
  },
  {
    id: 2,
    title: "이름을 잘못 적었어요.",
    category: "QnA",
    writer: "짱짱맨",
    publishDate: "2024-02-28",
    views: 291,
  },
  {
    id: 3,
    title: "수료증은 어디서 확인할 수 있죠?",
    category: "QnA",
    writer: "데이빗",
    publishDate: "2024-01-20",
    views: 465,
  },
  {
    id: 4,
    title: "이수증서는 어디에서 사용이 가능한가요?",
    category: "QnA",
    writer: "주노",
    publishDate: "2024-03-01",
    views: 300,
  },
  {
    id: 5,
    title: "설문조사를 해야지만 이수증서를 받을 수 있나요?",
    category: "QnA",
    writer: "튜니",
    publishDate: "2024-01-10",
    views: 620,
  },
  {
    id: 6,
    title: "OOOO 교육 영상은 없나요?",
    category: "QnA",
    writer: "에드워드",
    publishDate: "2024-03-05",
    views: 350,
  },
  {
    id: 7,
    title: "회사메일로 가입할 수 없나요?",
    category: "QnA",
    writer: "루시오",
    publishDate: "2024-02-14",
    views: 410,
  },
  {
    id: 8,
    title: "OOOO 교육 영상은 없나요?",
    category: "QnA",
    writer: "Sophie Lee",
    publishDate: "2024-02-20",
    views: 255,
  },
  {
    id: 9,
    title: "설문조사를 해야지만 이수증서를 받을 수 있나요?",
    category: "QnA",
    writer: "Lucas Kim",
    publishDate: "2024-03-03",
    views: 530,
  },
  {
    id: 10,
    title: "이수증서는 어디에서 사용이 가능한가요?",
    category: "QnA",
    writer: "Olivia Jeong",
    publishDate: "2024-03-18",
    views: 480,
  },
  {
    id: 11,
    title: "회사메일로 가입할 수 없나요?",
    category: "QnA",
    writer: "Brian Choi",
    publishDate: "2024-02-22",
    views: 390,
  },
  {
    id: 12,
    title: "How to Stay Safe Online",
    category: "QnA",
    writer: "Grace Park",
    publishDate: "2024-03-10",
    views: 650,
  },
  {
    id: 13,
    title: "Global Economic Outlook for 2024",
    category: "QnA",
    writer: "Ethan Kang",
    publishDate: "2024-01-25",
    views: 280,
  },
  {
    id: 14,
    title: "Innovations in Artificial Intelligence",
    category: "QnA",
    writer: "Lily Kim",
    publishDate: "2024-02-15",
    views: 500,
  },
  {
    id: 15,
    title: "Learning Foreign Languages",
    category: "QnA",
    writer: "Noah Lee",
    publishDate: "2024-02-05",
    views: 320,
  },
  {
    id: 16,
    title: "Nutritional Myths Debunked",
    category: "QnA",
    writer: "Emma Choi",
    publishDate: "2024-03-07",
    views: 290,
  },
  {
    id: 17,
    title: "The Evolution of Cinema",
    category: "QnA",
    writer: "Jack Kim",
    publishDate: "2024-02-12",
    views: 430,
  },
  {
    id: 18,
    title: "Ultimate Guide to Backpacking in Europe",
    category: "QnA",
    writer: "Chloe Lee",
    publishDate: "2024-03-21",
    views: 370,
  },
  {
    id: 19,
    title: "Mindfulness and Mental Health",
    category: "QnA",
    writer: "Daniel Yoo",
    publishDate: "2024-01-30",
    views: 260,
  },
  {
    id: 20,
    title: "Revolutionizing Healthcare with Technology",
    category: "QnA",
    writer: "Sophia Park",
    publishDate: "2024-02-01",
    views: 540,
  },
];

const SentencingList = [
  {
    id: 1,
    title: "양형교육이란 무엇인가요?",
    category: "양형교육",
    writer: "김수한무",
    publishDate: "2024-03-15",
    views: 512,
  },
  {
    id: 2,
    title: "이수증서는 어디서 사용할 수 있나요?",
    category: "양형교육",
    writer: "거북이와두리미",
    publishDate: "2024-02-28",
    views: 291,
  },
  {
    id: 3,
    title: "완강했는데, 수료증은 어디서 확인할 수 있죠?",
    category: "양형교육",
    writer: "삼천갑자",
    publishDate: "2024-01-20",
    views: 465,
  },
  {
    id: 4,
    title: "범죄사실은 없지만 양형교육을 들어도 상관없나요?",
    category: "양형교육",
    writer: "동박삭",
    publishDate: "2024-03-01",
    views: 300,
  },
  {
    id: 5,
    title: "설문조사를 해야지만 이수증서를 받을 수 있나요?",
    category: "양형교육",
    writer: "치치카포",
    publishDate: "2024-01-10",
    views: 620,
  },
  {
    id: 6,
    title: "OOOO 교육 영상은 없나요?",
    category: "양형교육",
    writer: "사리사리센타",
    publishDate: "2024-03-05",
    views: 350,
  },
  {
    id: 7,
    title: "회사메일로 가입할 수 없나요?",
    category: "양형교육",
    writer: "워리워리",
    publishDate: "2024-02-14",
    views: 410,
  },
  {
    id: 8,
    title: "OOOO 교육 영상은 없나요?",
    category: "양형교육",
    writer: "Sophie Lee",
    publishDate: "2024-02-20",
    views: 255,
  },
  {
    id: 9,
    title: "설문조사를 해야지만 이수증서를 받을 수 있나요?",
    category: "양형교육",
    writer: "Lucas Kim",
    publishDate: "2024-03-03",
    views: 530,
  },
  {
    id: 10,
    title: "이수증서는 어디에서 사용이 가능한가요?",
    category: "양형교육",
    writer: "Olivia Jeong",
    publishDate: "2024-03-18",
    views: 480,
  },
  {
    id: 11,
    title: "회사메일로 가입할 수 없나요?",
    category: "양형교육",
    writer: "Brian Choi",
    publishDate: "2024-02-22",
    views: 390,
  },
  {
    id: 12,
    title: "How to Stay Safe Online",
    category: "양형교육",
    writer: "Grace Park",
    publishDate: "2024-03-10",
    views: 650,
  },
  {
    id: 13,
    title: "Global Economic Outlook for 2024",
    category: "양형교육",
    writer: "Ethan Kang",
    publishDate: "2024-01-25",
    views: 280,
  },
  {
    id: 14,
    title: "Innovations in Artificial Intelligence",
    category: "양형교육",
    writer: "Lily Kim",
    publishDate: "2024-02-15",
    views: 500,
  },
  {
    id: 15,
    title: "Learning Foreign Languages",
    category: "양형교육",
    writer: "Noah Lee",
    publishDate: "2024-02-05",
    views: 320,
  },
  {
    id: 16,
    title: "Nutritional Myths Debunked",
    category: "양형교육",
    writer: "Emma Choi",
    publishDate: "2024-03-07",
    views: 290,
  },
  {
    id: 17,
    title: "The Evolution of Cinema",
    category: "양형교육",
    writer: "Jack Kim",
    publishDate: "2024-02-12",
    views: 430,
  },
  {
    id: 18,
    title: "Ultimate Guide to Backpacking in Europe",
    category: "양형교육",
    writer: "Chloe Lee",
    publishDate: "2024-03-21",
    views: 370,
  },
  {
    id: 19,
    title: "Mindfulness and Mental Health",
    category: "양형교육",
    writer: "Daniel Yoo",
    publishDate: "2024-01-30",
    views: 260,
  },
];

const DigitalUndertakerList = [
  {
    id: 1,
    title: "디지털장의사란 무엇인가요?",
    category: "디지털장의사",
    writer: "가가가",
    publishDate: "2024-03-15",
    views: 512,
  },
  {
    id: 2,
    title: "이수증서는 어디서 사용할 수 있나요?",
    category: "디지털장의사",
    writer: "나나나",
    publishDate: "2024-02-28",
    views: 291,
  },
  {
    id: 3,
    title: "완강했는데, 수료증은 어디서 확인할 수 있죠?",
    category: "디지털장의사",
    writer: "다다다",
    publishDate: "2024-01-20",
    views: 465,
  },
  {
    id: 4,
    title: "범죄사실은 없지만 디지털 장의사 교육을 들어도 상관없나요? 궁금해요",
    category: "디지털장의사",
    writer: "라라라",
    publishDate: "2024-03-01",
    views: 300,
  },
  {
    id: 5,
    title: "설문조사를 해야지만 이수증서를 받을 수 있나요?",
    category: "디지털장의사",
    writer: "마마마",
    publishDate: "2024-01-10",
    views: 620,
  },
  {
    id: 6,
    title: "OOOO 교육 영상은 없나요?",
    category: "디지털장의사",
    writer: "바바바",
    publishDate: "2024-03-05",
    views: 350,
  },
  {
    id: 7,
    title: "회사메일로 가입할 수 없나요?",
    category: "디지털장의사",
    writer: "사사사",
    publishDate: "2024-02-14",
    views: 410,
  },
  {
    id: 8,
    title: "OOOO 교육 영상은 없나요?",
    category: "디지털장의사",
    writer: "Sophie Lee",
    publishDate: "2024-02-20",
    views: 255,
  },
  {
    id: 9,
    title: "설문조사를 해야지만 이수증서를 받을 수 있나요?",
    category: "디지털장의사",
    writer: "Lucas Kim",
    publishDate: "2024-03-03",
    views: 530,
  },
  {
    id: 10,
    title: "이수증서는 어디에서 사용이 가능한가요?",
    category: "디지털장의사",
    writer: "Olivia Jeong",
    publishDate: "2024-03-18",
    views: 480,
  },
  {
    id: 11,
    title: "회사메일로 가입할 수 없나요?",
    category: "디지털장의사",
    writer: "Brian Choi",
    publishDate: "2024-02-22",
    views: 390,
  },
  {
    id: 12,
    title: "How to Stay Safe Online",
    category: "디지털장의사",
    writer: "Grace Park",
    publishDate: "2024-03-10",
    views: 650,
  },
  {
    id: 13,
    title: "Global Economic Outlook for 2024",
    category: "디지털장의사",
    writer: "Ethan Kang",
    publishDate: "2024-01-25",
    views: 280,
  },
  {
    id: 14,
    title: "Innovations in Artificial Intelligence",
    category: "디지털장의사",
    writer: "Lily Kim",
    publishDate: "2024-02-15",
    views: 500,
  },
  {
    id: 15,
    title: "Learning Foreign Languages",
    category: "디지털장의사",
    writer: "Noah Lee",
    publishDate: "2024-02-05",
    views: 320,
  },
  {
    id: 16,
    title: "Nutritional Myths Debunked",
    category: "디지털장의사",
    writer: "Emma Choi",
    publishDate: "2024-03-07",
    views: 290,
  },
  {
    id: 17,
    title: "The Evolution of Cinema",
    category: "디지털장의사",
    writer: "Jack Kim",
    publishDate: "2024-02-12",
    views: 430,
  },
];

export const QnAPagination = () => {
  const [activeTab, setActiveTab] = useState("QnA");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const {getInquiries, inquiries, clearInquiries} = inquiry((state=> ({getInquiries: state.getInquiries, inquiries: state.inquiries, clearInquiries: state.clearInquiries})))

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7; // 한 페이지당 보여줄 데이터 수를 7로 변경
  const totalPosts = inquiries.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(()=>{
    clearInquiries();
    getInquiries()
  },[])

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
  const currentPosts = inquiries.slice(indexOfFirstPost, indexOfLastPost);

  const [currentPage2, setCurrentPage2] = useState(1);
  const postsPerPage2 = 7; // 한 페이지당 보여줄 데이터 수를 7로 변경
  const totalPosts2 = SentencingList.length;

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
  const currentPosts2 = SentencingList.slice(
    indexOfFirstPost2,
    indexOfLastPost2
  );

  const [currentPage3, setCurrentPage3] = useState(1);
  const postsPerPage3 = 7; // 한 페이지당 보여줄 데이터 수를 7로 변경
  const totalPosts3 = DigitalUndertakerList.length;

  const handlePageChange3 = (page) => {
    setCurrentPage3(page);
  };

  const renderPageButtons3 = () => {
    const pageButtons3 = [];
    const totalPages3 = Math.ceil(totalPosts3 / postsPerPage);
    let startPage3 = Math.max(currentPage3 - 2, 1);
    let endPage3 = Math.min(startPage3 + 4, totalPages3);

    // 현재 페이지가 첫 번째 페이지에 가까워서 페이지 버튼이 충분하지 않은 경우
    if (endPage3 - startPage3 < 4) {
      startPage3 = Math.max(endPage3 - 4, 1);
    }

    for (let i = startPage3; i <= endPage3; i++) {
      pageButtons3.push(
        <button
          key={i}
          className={
            currentPage3 === i
              ? "users-pagination-page-button active"
              : "users-pagination-page-button"
          }
          onClick={() => handlePageChange3(i)}
        >
          {i}
        </button>
      );
    }

    return pageButtons3;
  };

  const indexOfLastPost3 = currentPage3 * postsPerPage3;
  const indexOfFirstPost3 = indexOfLastPost3 - postsPerPage3;
  const currentPosts3 = DigitalUndertakerList.slice(
    indexOfFirstPost3,
    indexOfLastPost3
  );

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
                activeTab === "QnA" ? "active" : ""
              }`}
              onClick={() => handleTabClick("QnA")}
            >
              메인게시판
            </button>
            <button
              className={`user-pagination-tab-button ${
                activeTab === "Sentencing" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Sentencing")}
            >
              양형교육
            </button>
            <button
              className={`user-pagination-tab-button ${
                activeTab === "DigitalUndertaker" ? "active" : ""
              }`}
              onClick={() => handleTabClick("DigitalUndertaker")}
            >
              디지털장의사
            </button>
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
          {activeTab === "QnA" && (
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
                    {renderPageButtons()}
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
          {activeTab === "Sentencing" && (
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

                    <div>{post.writer}</div>
                    <div>{post.publishDate}</div>
                    <div>{post.views}</div>
                  </div>
                ))}
              </div>
              <div className="user-qna-pagination-footer">
                <div className="user-qna-pagination-count">
                  {SentencingList.length} results
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
          {activeTab === "DigitalUndertaker" && (
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
                {currentPosts3.map((post) => (
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

                    <div>{post.writer}</div>
                    <div>{post.publishDate}</div>
                    <div>{post.views}</div>
                  </div>
                ))}
              </div>
              <div className="user-qna-pagination-footer">
                <div className="user-qna-pagination-count">
                  {DigitalUndertakerList.length} results
                </div>
                <div className="user-qna-pagination-buttons">
                  <button
                    className={`user-qna-pagination-button ${
                      currentPage3 === 1 ? "disabled" : ""
                    }`}
                    onClick={() => handlePageChange3(currentPage3 - 1)}
                    disabled={currentPage3 === 1}
                  >
                    <img
                      className="img-11"
                      alt="Chevron left large"
                      src={leftArrowButton}
                    />
                  </button>
                  <div className="user-qna-pagination-button-wrap">
                    {renderPageButtons3()}
                  </div>
                  <button
                    className={`user-qna-pagination-button ${
                      currentPage3 === Math.ceil(totalPosts3 / postsPerPage3)
                        ? "disabled"
                        : ""
                    }`}
                    onClick={() => handlePageChange3(currentPage3 + 1)}
                    disabled={
                      currentPage3 === Math.ceil(totalPosts3 / postsPerPage3)
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

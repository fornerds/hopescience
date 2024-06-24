import "./style.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header, Footer, Button, Link } from "../../../components";
import { SummaryWithShowMore } from "../../../modules/SummaryWithShowMore";
import { Accordion } from "../../../modules/Accordion";
import { Pagination } from "../../../modules/Pagination/Pagination";
import { VideoModal } from "../../../modules/VideoModal";
import { service, courseInquiry } from "../../../store";
import mainImage from "../../../images/main.png"
import playButtonIcon from "../../../icons/play-button.svg"

export const Course = () => {
  let { course_id } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  const isLoading = service((state) => state.isLoading);
  const getService = service((state) => state.getService);
  const course = service((state) => state.course) || null;
  const getCourseInquiries = courseInquiry((state) => state.getCourseInquiries);
  const isCourseInquiriesLoading = courseInquiry((state) => state.isLoading);
  const courseInquiries =
    courseInquiry((state) => state.courseInquiries) || null;
  const data = sessionStorage.getItem("auth-storage");
  const myUserId = data ? JSON.parse(data).state?.user?.userId : null;
  useEffect(() => {
    getService(course_id);
    getCourseInquiries(course_id);
  }, []);
if(course){
  console.log(course?.sections[0].lectures[0].video_url)
}

  return (
    <>
      <Header />
      <main className="course-background">
        <section className="course-section">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2 className="course-title">{course?.title}</h2>
              <div className="course-desc">
                <div className="course-preview">
                  <div className="course-image-wrap">
                    <img
                      src={mainImage}
                      alt="강의 섬네일"
                      className="course-image"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="full"
                    label="강의미리보기"
                    onClick={handleOpenModal}
                  />
                </div>
                <div className="course-info">
                  <div>
                    <h3 className="course-index-text">요약설명</h3>
                    <SummaryWithShowMore summary={course?.summary} />
                    <div className="course-info-flex course-info-price">
                      <h3 className="course-index-text">결제금액</h3>
                      <div className="course-price">
                        <div className="">
                          {course?.discounted_price.toLocaleString()}원
                        </div>{" "}
                        {(course?.price === course?.discounted_price)? "" : <del>{course?.price.toLocaleString()}원</del>}
                      </div>
                    </div>
                    <div className="course-info-flex course-info-service-period">
                      <h3 className="course-index-text">서비스 제공기간</h3>
                      <div className="course-service-period">
                      온라인 상품 구매 후 바로 사용이 가능하며, 무제한으로 서비스 이용이 가능합니다.
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/cart/${myUserId}/${course?.id}`}
                    buttonStyle="default"
                    label="수강신청하기"
                    color="white"
                    fontSize="16px"
                    style={{ width: "100%", height: "56px" }}
                  />
                </div>
              </div>
              <div className="course-detail">
                <img
                  className="button-play-6"
                  alt="Button play"
                  src={playButtonIcon}
                />
                <div className="course-detail-wrap">
                  <h3 className="course-index-text">상세설명</h3>
                  <div className="course-detail-desc">
                    {course?.description}
                  </div>
                </div>
              </div>
              <div className="course-lecture-list">
                <img
                  className="button-play-6"
                  alt="Button play"
                  src={playButtonIcon}
                />
                <div className="course-lecture-list-wrap">
                  <h3 className="course-index-text">강의구성</h3>
                  {course?.sections?.map((section) => (
                    <Accordion key={section.id} section={section} />
                  ))}
                </div>
              </div>
              <div className="course-QnA">
                <img
                  className="button-play-6"
                  alt="Button play"
                  src={playButtonIcon}
                />
                <div className="course-QnA-wrap">
                  <h3 className="course-index-text">QnA</h3>
                  <Pagination
                    inquiries={courseInquiries}
                    isLoading={isCourseInquiriesLoading}
                  />
                </div>
              </div>
            </>
          )}
        </section>
        <VideoModal
          isOpen={isOpen}
          videoSrc={course?.sections[0].lectures[0].video_url}
          onClose={handleCloseModal}
        />
      </main>
      <Footer />
    </>
  );
};
